import { useUser } from "@clerk/nextjs";
import CircularProgress from '@mui/material/CircularProgress';
import React from "react";
import { api } from "~/utils/api";
import FileBlock from "./fileBlock";

import { Issue } from '@prisma/client';

function GradientCircularProgress() {
    return (
        <React.Fragment>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e01cd5" />
                        <stop offset="100%" stopColor="#1CB5E0" />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </React.Fragment>
    );
}

interface TreeNode {
    _data?: Issue; // Issue data for files, undefined for folders
    _children: { [key: string]: TreeNode }; // Always initialized to an object, never undefined
}

const initializeTreeNode = (): TreeNode => {
    return { _children: {} };
};


import { useEffect } from 'react';
import FolderBlock from "./folderBlock";

export default function ReportContainer({ reportId }: { reportId: string }) {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();

    if (!user) {
        return <></>;
    }

    const issues = api.issue.getIssuesByReport.useQuery({ reportId: reportId });

    useEffect(() => {
        const startTime = Date.now();

        const intervalId = setInterval(() => {
            issues.refetch();

            if (Date.now() - startTime > 60000) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [issues, reportId]);

    if (!issues.data || issues.data.length === 0) {
        return (
            <div className="w-36 h-36 flex justify-center items-center">
                <GradientCircularProgress />
            </div>
        );
    }

    const ensureTreeNode = (node?: TreeNode): TreeNode => {
        if (!node) {
            return { _children: {} };
        }
        return node;
    };

    const buildFileTree = (issues: Issue[]): TreeNode => {
        const root: TreeNode = initializeTreeNode(); // Initialize the root node

        issues.forEach(issue => {
            const parts = issue.filename.split('/');
            let current = root; // Start from the root

            parts.forEach((part, index) => {
                if (!current._children[part]) {
                    current._children[part] = initializeTreeNode();
                }

                if (index === parts.length - 1) {
                    current._children[part]!._data = issue;
                } else {
                    current = current._children?.[part] || initializeTreeNode();
                }
            });
        });

        return root;
    };


    const renderTree = (node: { [key: string]: TreeNode }, path = ''): JSX.Element[] => {
        return Object.entries(node).map(([key, value]) => {
            const currentPath = path ? `${path}/${key}` : key;
            // Check if it's a file
            if (value._data) {
                // Ensure the File component is correctly typed to accept `issue` as a prop
                return <FileBlock issue={value._data} />;
            } else {
                // Recurse into _children if it's a folder
                return (
                    <FolderBlock key={currentPath} name={key}>
                        {renderTree(value._children, currentPath)}
                    </FolderBlock>
                );
            }
        });
    };

    const fileTree = buildFileTree(issues.data ? issues.data : []);

    return (
        <>
            <div className="w-3/6">
                {/* {issues.data?.map((issue) => (
                    <FileBlock key={issue.id} filename={issue.filename} status={issue.status} descriptions={issue.description} />
                ))} */}
                {renderTree(fileTree._children)}
            </div>
        </>
    );
}
