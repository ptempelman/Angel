import { useUser } from "@clerk/nextjs";
import CircularProgress from '@mui/material/CircularProgress';
import React from "react";
import { api } from "~/utils/api";
import FileBlock from "./fileBlock";

import { Issue } from '@prisma/client';

interface IssueType {
    critical?: string;
    moderate?: string;
    low?: string;
}

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

type IssueCounts = { critical: number, moderate: number, low: number };


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

    const reduceTypes = (input: Issue[]) => {
        return input.reduce(
            (acc, issue) => {
                const type = Object.keys(issue)[0] as keyof IssueType;
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            },
            { critical: 0, moderate: 0, low: 0 }
        );
    }

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

    const parseIssues = (jsonString: string): IssueType[] => {
        try {
            const parsed = JSON.parse(jsonString);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            console.error('Failed to parse descriptions JSON:', error);
        }
        return [];
    };

    const calculateStatusAndCounts = (node: TreeNode, parentCounts: IssueCounts = { critical: 0, moderate: 0, low: 0 }): { counts: IssueCounts, subtreeHasProcessing: boolean } => {
        let subtreeHasProcessing = false;
        let localCounts: IssueCounts = { critical: 0, moderate: 0, low: 0 };

        if (node._data) {
            const fileData = node._data;
            const fileIssues: IssueType[] = parseIssues(fileData.description);
            const fileCounts = fileIssues.reduce<IssueCounts>((acc, issue) => {
                const type = Object.keys(issue)[0] as keyof IssueType;
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, { critical: 0, moderate: 0, low: 0 });

            Object.keys(fileCounts).forEach(key => {
                localCounts[key as keyof IssueCounts] += fileCounts[key as keyof IssueCounts];
            });

            if (fileData.status === 'processing') {
                subtreeHasProcessing = true;
            }
        } else {
            Object.values(node._children).forEach(child => {
                const childResult = calculateStatusAndCounts(child);
                subtreeHasProcessing ||= childResult.subtreeHasProcessing;
                Object.keys(childResult.counts).forEach(key => {
                    localCounts[key as keyof IssueCounts] += childResult.counts[key as keyof IssueCounts];
                });
            });
        }

        Object.keys(localCounts).forEach(key => {
            parentCounts[key as keyof IssueCounts] += localCounts[key as keyof IssueCounts];
        });

        return { counts: parentCounts, subtreeHasProcessing };
    };

    const renderTree = (node: { [key: string]: TreeNode }, path = ''): JSX.Element[] => {
        return Object.entries(node).map(([key, value]) => {
            const currentPath = path ? `${path}/${key}` : key;
            const result = calculateStatusAndCounts(value);
            const status = result.subtreeHasProcessing ? 'processing' : 'completed';

            if (value._data) {
                return <FileBlock issue={value._data} key={currentPath} />;
            } else {
                return (
                    <FolderBlock key={currentPath} name={key} status={status} counts={result.counts}>
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
                {renderTree(fileTree._children)}
            </div>
        </>
    );
}