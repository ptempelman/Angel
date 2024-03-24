from dotenv import load_dotenv
import requests
from urllib.parse import urlparse
import anthropic
import concurrent.futures
from github_api_test import GithubRepoExplorer
import os
from status_api import feed_back_to_nextjs

load_dotenv()


class AnthropicLLM:
    def __init__(self, api_key):
        try:
            ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", None)
            # print(f"ANTHROPIC_API_KEY: {ANTHROPIC_API_KEY}")
            self.api_key = ANTHROPIC_API_KEY
            self.client = anthropic.Anthropic(api_key=self.api_key)
        except Exception as e:
            print(f"An error occurred with Anthropic API KEY: {e}")

    def generate_response(self, prompt, file_name):
        try:
            message = self.client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=4096,
                messages=[{"role": "user", "content": prompt}],
            )
            return message.content[0].text
        except Exception as e:
            print(f"An error occurred in {file_name}: {e}")
            # Optionally, re-raise the exception if you want it to propagate
            raise


def process_file(file_name, file_content, api_key, reportId, analysis_type):
    print("sending back feedback to nextjs")
    feed_back_to_nextjs(reportId, file_name, "processing", {})
    llm = AnthropicLLM(api_key)
    print("prompting llm to generate response...")
    prompt = f"""
    You are a critical code analyzer. You will generate a report to highlight potential 
    issues regarding code {analysis_type}. The file is {file_name}. 
    You should return ONLY JSON. So in your response, just start with the JSON object, 
    and say nothing else. The JSON object should have only three types of keys, “critical”, 
    “moderate”, and low. Be reserved in handing out critical labels. The response 
    should be formatted e.g. like this: [{{"critical": "System failure imminent due to 
    overheating of core processing unit."}},{{"moderate": "Inconsistent data validation 
    across forms, leading to potential data integrity issues." }}, {{ "moderate": "API 
    response times are slower than expected, affecting user experience." }}, {{ "low": 
    "User interface misalignments in the settings menu on mobile devices."}}, {{"low": 
    "Deprecated API usage in module X, though currently not affecting functionality."}}] . 
    Remember to only return issues related to code {analysis_type}, and very important: 
    return only JSON. Here is the file content: {file_content} """
    response = llm.generate_response(prompt, file_name)
    feed_back_to_nextjs(reportId, file_name, "completed", response)
    print("prompting done and result sent")
    return file_name, response


def analyze_github_repo(repo_url, reportId, analysis_type):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    print(f"API KEY {api_key}")
    explorer = GithubRepoExplorer(repo_url)
    file_structure = explorer.build_file_structure_flat()

    print("file structure built")

    print("trying to process files concurrently...")

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(
                process_file, file_name, file_content, api_key, reportId, analysis_type
            )
            for file_name, file_content in file_structure.items()
        ]
        results = [
            future.result() for future in concurrent.futures.as_completed(futures)
        ]

    analysis_dict = {file_name: result for file_name, result in results}
    print("analysis_dict:", analysis_dict)
    return analysis_dict


# # Example usage
# repo_url = "https://github.com/AmirFone/Simulating-Paxos-consistency-algorithm"

# analysis_results = analyze_github_repo(repo_url)

# for file_name, analysis in analysis_results.items():
#     print(f"File: {file_name}")
#     print(f"Security Analysis: {analysis}")
#     print("-" * 50)
