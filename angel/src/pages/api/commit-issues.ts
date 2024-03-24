// commit-issues.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createGithubIssue } from '../../utils/githubApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { accessToken, issue } = req.body;

    if (!accessToken || !issue) {
      return res.status(400).json({ error: 'Access token or issue data missing' });
    }

    try {
      const { title, body, filename } = issue;

      // Extract the owner and repo name from the filename
      const [owner, repo] = filename.split('/').slice(0, 2);

      // Construct the issue body
      const issueBody = `
        Issue: ${title}
        File: ${filename}

        ${body}
      `;

      // Create the issue on GitHub
      await createGithubIssue(`https://github.com/${owner}/${repo}`, accessToken, title, issueBody);

      return res.status(200).json({ message: 'Issue committed successfully' });
    } catch (error) {
      console.error('Error committing issue:', error);
      return res.status(500).json({ error: 'Failed to commit issue' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}