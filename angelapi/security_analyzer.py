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
            print(f"ANTHROPIC_API_KEY: {ANTHROPIC_API_KEY}")
            self.api_key = ANTHROPIC_API_KEY
            self.client = anthropic.Anthropic(api_key=self.api_key)
        except Exception as e:
            print(f"An error occurred with Anthropic API KEY: {e}")

    def generate_response(self, prompt):
        message = self.client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )

        return message.content[0].text


def process_file(file_name, file_content, api_key):
    feed_back_to_nextjs(file_name, "processing", {})
    llm = AnthropicLLM(api_key)
    prompt = f"""
Given this code in file {file_name}:

{file_content}

Can you list the main security issues categorized as Critical, Moderate, and Low? 
When you classify these issues, make sure they are concise (not longer than 2 sentences).
Also, provide some context for where each problem is occurring in the code.
Output the results in JSON format like this:

[
{{
    "critical": "Issue 1"
}},
{{
    "moderate": "Issue 2"
}},
{{
    "low": "Issue 3"
}}
]

example output:
[
    {{
        "critical": "System failure imminent due to overheating of core processing unit."
    }},
    {{
        "critical": "Data breach detected, with significant risk of sensitive information being compromised."
    }},
    {{
        "critical": "Unauthorized access to internal networks identified."
    }},
    {{
        "critical": "Hardware failure in main server leading to potential data loss."
    }},
    {{
        "critical": "Encryption protocols outdated, exposing data to interception."
    }},
    {{
        "moderate": "Memory leaks observed in software version 1.2.4, causing performance degradation."
    }},
    {{
        "moderate": "Inconsistent data validation across forms, leading to potential data integrity issues."
    }},
    {{
        "moderate": "API response times are slower than expected, affecting user experience."
    }},
    {{
        "moderate": "Outdated third-party libraries found, posing a security risk."
    }},
    {{
        "moderate": "Excessive memory usage in the client application affecting older devices."
    }},
    {{
        "minor": "User interface misalignments in the settings menu on mobile devices."
    }},
    {{
        "minor": "Deprecated API usage in module X, though currently not affecting functionality."
    }},
    {{
        "minor": "Incorrect error messages displayed for certain input validation errors."
    }},
    {{
        "minor": "Minor spelling errors found in the help documentation."
    }}
]
it is very important to provide the output in the exact format as shown above. no other format will be accepted for this task just return it in the json object format nothing else!! also dont start with "Here are the main security issues categorized as Critical, Moderate, and Low in the provided code:" or anything like that just start with the json object
"""
    response = llm.generate_response(prompt)
    feed_back_to_nextjs(file_name, "completed", response)
    return file_name, response


def analyze_github_repo(repo_url):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    print(f"API KEY {api_key}")
    explorer = GithubRepoExplorer(repo_url)
    file_structure = explorer.build_file_structure_flat()

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(process_file, file_name, file_content, api_key)
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
