// IssueModal.tsx
import React, { useState } from 'react';

interface Issue {
  filename: string;
  issue: string;
}

interface IssueModalProps {
  issues: Issue[];
  onClose: () => void;
  onPushIssue: (issue: Issue) => void;
}

const IssueModal: React.FC<IssueModalProps> = ({ issues, onClose, onPushIssue }) => {
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);

  const handlePrevIssue = () => {
    setCurrentIssueIndex((prevIndex) => (prevIndex - 1 + issues.length) % issues.length);
  };

  const handleNextIssue = () => {
    setCurrentIssueIndex((prevIndex) => (prevIndex + 1) % issues.length);
  };

  const handlePushIssue = () => {
    const currentIssue = issues[currentIssueIndex];
    if (currentIssue) {
      onPushIssue(currentIssue);
    }
  };

  if (issues.length === 0) {
    return null;
  }

  const currentIssue = issues[currentIssueIndex];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(255, 0, 0, 0.5)', border: '2px solid red' }}
    >
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Issues</h2>
        <div>
          <p>File: {currentIssue.filename}</p>
          <p>Issue: {currentIssue.issue}</p>
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={handlePrevIssue}>Previous</button>
          <button onClick={handleNextIssue}>Next</button>
        </div>
        <button onClick={handlePushIssue} className="mt-4">
          Push Issue to Repo
        </button>
        <button onClick={onClose} className="mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default IssueModal;