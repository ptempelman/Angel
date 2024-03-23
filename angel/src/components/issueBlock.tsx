import React, { useState } from 'react';

interface Issue {
    critical?: string;
    moderate?: string;
    minor?: string;
}

interface IssueBlockProps {
    filename: string;
    descriptions: Issue[]; // Expect an array of Issue objects
}

const IssueBlock: React.FC<IssueBlockProps> = ({ filename, descriptions }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const issues: Issue[] = descriptions;

    const counts = issues.reduce(
        (acc, issue) => {
            const type = Object.keys(issue)[0] as keyof Issue;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        },
        { critical: 0, moderate: 0, minor: 0 }
    );

    return (
        <div
            className="border-2 border-white p-5 m-5 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex justify-between items-center text-white">
                <h2 className="text-white">{filename}</h2>
                <div>
                    <span className="text-red-500">● {counts.critical}</span>
                    <span className="ml-2.5 text-orange-500">● {counts.moderate}</span>
                    <span className="ml-2.5 text-green-500">● {counts.minor}</span>
                </div>
            </div>
            {expanded && (
                <div className="mt-5">
                    {issues.map((issue, index) => {
                        const entry = Object.entries(issue)[0];
                        if (!entry) return null;

                        const [type, description] = entry as [keyof Issue, string];

                        let colorClass = '';
                        switch (type) {
                            case 'critical':
                                colorClass = 'text-red-500';
                                break;
                            case 'moderate':
                                colorClass = 'text-orange-500';
                                break;
                            case 'minor':
                                colorClass = 'text-green-500';
                                break;
                            default:
                                colorClass = 'text-gray-500';
                        }
                        return (
                            <div key={index} className="flex items-center mb-2.5">
                                <span className={`${colorClass} mr-2.5`}>●</span>
                                {/* Encapsulate description text to ensure it wraps within a predefined width */}
                                <span className="text-white text-xs max-w-xl break-words">{description}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default IssueBlock;
