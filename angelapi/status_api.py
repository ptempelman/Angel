import json
import os

from dotenv import load_dotenv
import requests

load_dotenv()

def feed_back_to_nextjs(reportId, filename, status, report):

    url = os.environ.get("NEXTJS_API_URL")

    report_json = report if isinstance(report, str) else json.dumps(report)

    data = {
        "reportId": reportId,
        "filename": filename,
        "status": status,  # "processing" or "completed"
        "result": report_json,
    }

    response = requests.post(url, json=data)

    if response.status_code in [202, 200]:
        print(f"Success: {response.json()}")
    else:
        print(f"Error: {response.status_code}, Message: {response.text}")
