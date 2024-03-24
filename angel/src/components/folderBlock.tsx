import { LinearProgress } from '@mui/material';
import React, { useState } from 'react';

interface Issue {
    critical?: string;
    moderate?: string;
    low?: string;
}

interface IssueBlockProps {
    filename: string;
    status: string;
    descriptions: string; // Assuming descriptions is a JSON string representation of Issue[]
}

type IssueCounts = { critical: number, moderate: number, low: number };


function GradientLinearProgress() {
    return (
        <LinearProgress sx={{
            height: 10, // Adjust the height as needed
            '& .MuiLinearProgress-bar': {
                backgroundImage: 'linear-gradient(to right, #e01cd5, #1CB5E0)', // Directly apply the gradient
            },
            // Optionally, if you need to adjust the background color of the component itself:
            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Example background color
        }} />
    );
}

const FolderBlock = ({ name, children, status, counts }: { name: string, children?: React.ReactNode, status: string, counts: IssueCounts }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div className="cursor-pointer">
            {/* Main rectangle */}
            <div
                className="border-2 border-white p-1 flex justify-between items-center text-white mb-1"
                onClick={() => setExpanded(!expanded)}
                style={{ minWidth: 0 }} // Ensure div can shrink if necessary
            >
                <h2 className="flex-shrink-0">{name.includes("/") ? name.split("/").pop() : name}</h2>
                {status === 'processing' && (
                    <div className='flex-grow h-2 mx-2'>
                        <div className="min-w-0 flex-1">
                            <GradientLinearProgress />
                        </div>
                    </div>
                )}
                <div className="flex-shrink-0 flex items-center">
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
                <div className="bg-white bg-opacity-10 ml-4 max-w-[calc(100%-1rem)]">
                    <div>{children}</div>
                </div>
            )}
        </div>
    );
};

export default FolderBlock;
