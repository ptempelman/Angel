// IssueModal.tsx
import React from 'react';
import { useUser } from '@clerk/nextjs';

interface Issue {
  title: string;
  body: string;
  filename: string;
}

interface IssueModalProps {
  issues: Issue[];
  onCommitIssues: (accessToken: string) => void;
  onClose: () => void;
}

const IssueModal: React.FC<IssueModalProps> = ({ issues, onCommitIssues, onClose }) => {
  const { user } = useUser();

  const handleCommitIssues = async () => {
    if (user) {
      const accessToken = await user.id;
      onCommitIssues(accessToken);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Security Issues</h2>
      <ul>
        {issues.map((issue, index) => (
          <li key={index} className="mb-2">
            <h3 className="font-bold">{issue.title}</h3>
            <p>{issue.body}</p>
            <p className="text-sm text-gray-500">{issue.filename}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleCommitIssues}
        >
          Commit Issues
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default IssueModal;