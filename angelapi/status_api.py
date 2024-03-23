import json

import requests

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
