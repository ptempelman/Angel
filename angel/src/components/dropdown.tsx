import React, { useState } from 'react';

type IssueType = 'critical' | 'moderate' | 'minor';

interface Issue {
  [key: string]: string;
}

const IssueDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Local issues data with a more specific type
  const issues: Issue[] = [
    { critical: "System failure imminent due to overheating of core processing unit." },
    { critical: "Data breach detected, with significant risk of sensitive information being compromised." },
    { critical: "Unauthorized access to internal networks identified." },
    { critical: "Hardware failure in main server leading to potential data loss." },
    { critical: "Encryption protocols outdated, exposing data to interception." },
    { moderate: "Memory leaks observed in software version 1.2.4, causing performance degradation." },
    { moderate: "Inconsistent data validation across forms, leading to potential data integrity issues." },
    { moderate: "API response times are slower than expected, affecting user experience." },
    { moderate: "Outdated third-party libraries found, posing a security risk." },
    { moderate: "Excessive memory usage in the client application affecting older devices." },
    { minor: "User interface misalignments in the settings menu on mobile devices." },
    { minor: "Deprecated API usage in module X, though currently not affecting functionality." },
    { minor: "Incorrect error messages displayed for certain input validation errors." },
    { minor: "Minor spelling errors found in the help documentation." },
    { minor: "The color scheme of the dashboard does not meet accessibility standards." },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const renderIssues = (severity: IssueType) => issues
    .filter(issue => issue[severity] !== undefined)
    .map((issue, index) => (
      <div key={index} className={`issue ${severity}`}>
        {issue[severity]}
      </div>
    ));

  return (
    <div>
      <button onClick={toggleDropdown} className="file-name text-white">
        View Issues
      </button>
      {isOpen && (
        <div className="issue-list text-white">
          <h3 className="text-white">Critical Issues</h3>
          {renderIssues('critical')}
          <h3 className="text-white">Moderate Issues</h3>
          {renderIssues('moderate')}
          <h3 className="text-white">Minor Issues</h3>
          {renderIssues('minor')}
        </div>
      )}
    </div>
  );
};

export default IssueDropdown;
