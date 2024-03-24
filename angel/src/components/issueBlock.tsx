import React, { useState } from 'react';

interface Issue {
    critical?: string;
    moderate?: string;
    low?: string;
}

interface IssueBlockProps {
    filename: string;
    descriptions: string; // Assuming descriptions is a JSON string representation of Issue[]
}

const IssueBlock: React.FC<IssueBlockProps> = ({ filename, descriptions }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    // Function to safely parse JSON string to Issue[]
    const parseIssues = (jsonString: string): Issue[] => {
        try {
            const parsed = JSON.parse(jsonString);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            console.error('Failed to parse descriptions JSON:', error);
        }
        return []; // Return an empty array if parsing fails or if the result is not an array
    };

    const issues: Issue[] = parseIssues(descriptions);

    const counts = issues.reduce(
        (acc, issue) => {
            const type = Object.keys(issue)[0] as keyof Issue;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        },
        { critical: 0, moderate: 0, low: 0 }
    );

    return (
        <div className="m-2 cursor-pointer">
            {/* Main rectangle */}
            <div
                className="border-2 border-white p-1 flex justify-between items-center text-white"
                onClick={() => setExpanded(!expanded)}
            >
                <h2>{filename}</h2>
                <div>
                    {counts.critical > 0 && (
                        <span className="text-red-500">● {counts.critical}</span>
                    )}
                    {counts.moderate > 0 && (
                        <span className={`ml-2.5 text-orange-500 ${counts.critical > 0 ? '' : 'ml-0'}`}>● {counts.moderate}</span>
                    )}
                    {counts.low > 0 && (
                        <span className={`ml-2.5 text-green-500 ${counts.critical > 0 || counts.moderate > 0 ? '' : 'ml-0'}`}>● {counts.low}</span>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="border-2 border-white bg-white bg-opacity-10 mt-2 p-4 max-w-[calc(100%-1rem)] mx-auto">
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
                            case 'low':
                                colorClass = 'text-green-500';
                                break;
                            default:
                                colorClass = 'text-gray-500';
                        }
                        return (
                            <div key={index} className="flex items-center mb-2.5">
                                <span className={`${colorClass} mr-2.5`}>●</span>
                                <span className="text-white break-words">{description}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default IssueBlock;
