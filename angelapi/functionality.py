import json

import requests

from security_analyzer import analyze_github_repo
def create_claude_api_call_with_file_content():
    prompt = ...
    pass


def filenames_and_content_from_repo():
    # Return {"filename": "LLM_content", "filename2": "LLM_content2"}    
    Dict=analyze_github_repo("url")


def feed_back_to_nextjs(filename, status, report):

    url = "http://localhost:3000/api/data"  # os.environ.get("NEXTJS_API_URL")

    report_json = report if isinstance(report, str) else json.dumps(report)

    data = {
        "filename": filename,
        "status": status,  # "processing" or "completed"
        "result": report_json,
    }

    response = requests.post(url, json=data)

    if response.status_code in [202, 200]:
        print(f"Success: {response.json()}")
    else:
        print(f"Error: {response.status_code}, Message: {response.text}")
