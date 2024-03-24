// githubApi.ts
import axios from 'axios';

export async function createGithubIssue(
  repoUrl: string,
  accessToken: string,
  title: string,
  body: string
) {
  const [owner, repo] = repoUrl.split('/').slice(-2);

  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

  const headers = {
    Authorization: `token ${accessToken}`,
    Accept: 'application/vnd.github.v3+json',
  };

  const data = {
    title,
    body,
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 201) {
      console.log('Issue created successfully!');
    } else {
      console.log(`Failed to create issue. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating issue:', error);
  }
}
