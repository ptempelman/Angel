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

const FolderBlock = ({ name, children }: { name: string, children?: React.ReactNode }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div className="cursor-pointer">
            {/* Main rectangle */}
            <div
                className="border-2 border-white p-1 flex justify-between items-center text-white mb-1"
                onClick={() => setExpanded(!expanded)}
            >
                <h2>{name.includes("/") ? name.split("/").pop() : name}</h2>
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
