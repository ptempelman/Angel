import requests
from urllib.parse import urlparse


class GithubRepoExplorer:
    def __init__(self, repo_url):
        self.repo_url = repo_url
        self.files_to_ignore = (
            ".txt",
            ".md",
            ".csv",
            ".json",
            ".xml",
            ".yaml",
            ".yml",
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".svg",
            ".bmp",
            ".ico",
            ".pdf",
            ".docx",
            ".xlsx",
            ".pptx",
            ".mp3",
            ".wav",
            ".mp4",
            ".mov",
            ".avi",
            ".ogg",
            ".zip",
            ".joblib",
            ".pkl",
            ".h5",
            ".pth",
            ".pt",
            ".tar",
            ".gz",
            ".bz2",
            ".xz",
            ".zst",
            ".rar",
            ".7z",
            ".gz_"
        )

    def get_file_contents_from_url(self, file_path):
        # Extract owner, repo name, and branch from the URL
        parts = self.repo_url.strip("/").split("/")
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

    def get_all_files_in_repo(self):
        # Parse the GitHub URL to extract owner and repo name
        parsed_url = urlparse(self.repo_url)
        path_parts = parsed_url.path.strip("/").split("/")
        owner = path_parts[0]
        repo = path_parts[1]

        # Fetch file list from the repository
        response = requests.get(
            f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
        )

        # Check if the response was successful
        if response.status_code == 200:
            tree = response.json()
            # Extract file paths from the tree, ignoring node modules, images, and videos
            files = [
                item["path"]
                for item in tree["tree"]
                if item["type"] == "blob"
                and "node_modules" not in item["path"]
                and not item["path"].lower().endswith(self.files_to_ignore)
            ]
            return files
        else:
            print(f"Failed to fetch file list: {response.status_code}")
            return []

    def build_file_structure(self):
        # Parse the GitHub URL to extract owner and repo name
        parsed_url = urlparse(self.repo_url)
        path_parts = parsed_url.path.strip("/").split("/")
        owner = path_parts[0]
        repo = path_parts[1]

        # Fetch file list from the repository
        response = requests.get(
            f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
        )

        # Check if the response was successful
        if response.status_code == 200:
            tree = response.json()
            file_structure = {}
            for item in tree["tree"]:
                if "node_modules" in item["path"] or item["path"].lower().endswith(
                    self.files_to_ignore
                ):
                    continue  # Skip node modules, images, and videos
                path = item["path"]
                path_parts = path.split("/")
                current = file_structure
                for part in path_parts[:-1]:
                    if part not in current:
                        current[part] = {}
                    current = current[part]
                if item["type"] == "blob":
                    file_content = self.get_file_contents_from_url(path)
                    current[path_parts[-1]] = file_content
            return file_structure
        else:
            print(f"Failed to fetch file list: {response.status_code}")
            return {}

    def build_file_structure_flat(self):
        # Parse the GitHub URL to extract owner and repo name
        parsed_url = urlparse(self.repo_url)
        path_parts = parsed_url.path.strip("/").split("/")
        owner = path_parts[0]
        repo = path_parts[1]

        # Fetch file list from the repository
        response = requests.get(
            f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
        )

        # Check if the response was successful
        if response.status_code == 200:
            tree = response.json()
            file_structure = {}
            for item in tree["tree"]:
                if "node_modules" in item["path"] or item["path"].lower().endswith(
                    self.files_to_ignore
                ):
                    continue  # Skip node modules, images, videos and other data files
                if item["type"] == "blob":
                    file_path = item["path"]
                    file_content = self.get_file_contents_from_url(file_path)
                    file_structure[file_path] = file_content
            return file_structure
        else:
            print(f"Failed to fetch file list: {response.status_code}")
            return {}


# Example usage
# repo_url = "https://github.com/AmirFone/Simulating-Paxos-consistency-algorithm"
# explorer = GithubRepoExplorer(repo_url)

# file_structure = explorer.build_file_structure_flat()
# print('File Structure:', file_structure)
