import React, { useState } from 'react';

const RepoInputForm = () => {
  const [repoLink, setRepoLink] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submitted link:', repoLink);
    // You can call a function here to handle the repository link
    // For example, fetching data based on the repository
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="repoLink" className="block text-sm font-medium text-white">
        GitHub Repository Link
      </label>
      <div className="mt-1">
        <input
          type="text"
          name="repoLink"
          id="repoLink"
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          className="block w-full rounded-md border-0 shadow-sm focus:ring-2 focus:ring-indigo-500 text-black py-2 px-4"
          style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }} // Smooth transition for focus
          placeholder="Enter GitHub repo link"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Get Report
      </button>
    </form>
  );
};

export default RepoInputForm;
