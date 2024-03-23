import requests
from urllib.parse import urlparse
import anthropic
import concurrent.futures
from github_api_test import GithubRepoExplorer
import os

class AnthropicLLM:
    def __init__(self, api_key):
        self.api_key = "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"
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def generate_response(self, prompt):
        message = self.client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message.content

def process_file(file_name, file_content, api_key):
    llm = AnthropicLLM(api_key)
    prompt = f"Analyze the following file for potential security threats:\n\nFile: {file_name}\n\nContent:\n{file_content}"
    response = llm.generate_response(prompt)
    return file_name, response

def analyze_github_repo(repo_url):
    explorer = GithubRepoExplorer(repo_url)
    file_structure = explorer.build_file_structure()

    api_key = os.environ.get("ANTHROPIC_API_KEY")

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(process_file, file_name, file_content, api_key) for file_name, file_content in file_structure.items()]
        results = [future.result() for future in concurrent.futures.as_completed(futures)]

    analysis_dict = {file_name: result for file_name, result in results}
    return analysis_dict

# Example usage
# repo_url = "https://github.com/AmirFone/Simulating-Paxos-consistency-algorithm"
# analysis_results = analyze_github_repo(repo_url)

# for file_name, analysis in analysis_results.items():
#     print(f"File: {file_name}")
#     print(f"Security Analysis: {analysis}")
#     print("-" * 50)