import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface Issue {
  title: string;
  body: string;
  filename: string;
}

interface IssueSliderProps {
  issues: Issue[];
  onCommitIssue: (accessToken: string, issueIndex: number) => void;
  onClose: () => void;
}

const IssueSlider: React.FC<IssueSliderProps> = ({ issues, onCommitIssue, onClose }) => {
  console.log('IssueSlider rendering with issues:', issues);
  const { user } = useUser();
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);

  const handlePrevIssue = () => {
    setCurrentIssueIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextIssue = () => {
    setCurrentIssueIndex((prevIndex) =>
      prevIndex < issues.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handleCommitIssue = async () => {
    if (user) {
      const accessToken = await user.id;
      onCommitIssue(accessToken, currentIssueIndex);
    }
  };

  if (issues.length === 0) {
    return null;
  }

  const currentIssue = issues[currentIssueIndex];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Issue {currentIssueIndex + 1} of {issues.length}</h2>
        {currentIssue ? (
          <>
            <h3 className="font-bold">{currentIssue.title}</h3>
            <p>{currentIssue.body}</p>
            <p className="text-sm text-gray-500">{currentIssue.filename}</p>
          </>
        ) : (
          <p>No issue found.</p>
        )}
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={handlePrevIssue}
            disabled={currentIssueIndex === 0}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleCommitIssue}
            disabled={!currentIssue}
          >
            Commit Issue
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={handleNextIssue}
            disabled={currentIssueIndex === issues.length - 1}
          >
            Next
          </button>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default IssueSlider;