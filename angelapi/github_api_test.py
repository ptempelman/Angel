import requests
from urllib.parse import urlparse

def get_file_contents_from_url(repo_url, file_path):
    # Extract owner, repo name, and branch from the URL
    parts = repo_url.strip("/").split("/")
    owner = parts[-2]
    repo_name = parts[-1]
    branch = "main"  # Assuming the default branch is 'main'

    # Construct the raw URL for the file
    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo_name}/{branch}/{file_path}"

    # Fetch file contents
    response = requests.get(raw_url)
    
    if response.status_code == 200:
        return response.text
    else:
        return None

# Example GitHub repository URL and file path
repo_url = "https://github.com/ptempelman/AngelAPI"

# All files
def get_all_files_in_repo(repo_url):
    # Parse the GitHub URL to extract owner and repo name
    parsed_url = urlparse(repo_url)
    path_parts = parsed_url.path.strip("/").split("/")
    owner = path_parts[0]
    repo = path_parts[1]

    # Fetch file list from the repository
    response = requests.get(f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1")
    
    # Check if the response was successful
    if response.status_code == 200:
        tree = response.json()
        # Extract file paths from the tree
        files = [item["path"] for item in tree["tree"] if item["type"] == "blob"]
        return files
    else:
        print(f"Failed to fetch file list: {response.status_code}")
        return []

files = get_all_files_in_repo(repo_url)

for file_path in files:
    content = get_file_contents_from_url(repo_url, file_path)
    if content:
        print(f"File: {file_path}\n\nContent:\n{content}\n{'-'*50}")
    else:
        print(f"Failed to fetch content for file: {file_path}")
