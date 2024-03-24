import { useUser } from "@clerk/nextjs";
import CircularProgress from '@mui/material/CircularProgress';
import React from "react";
import { api } from "~/utils/api";
import IssueBlock from "./issueBlock";


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

import { useEffect } from 'react';

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

    return (
        <>
            <div className="w-3/6">
                {issues.data?.map((issue) => (
                    <IssueBlock key={issue.id} filename={issue.filename} status={issue.status} descriptions={issue.description} />
                ))}
            </div>
        </>
    );
}
