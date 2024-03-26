import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from "~/utils/api";


interface ApiResponse {
    reportId: string;
    filename: string;
    status: 'processing' | 'completed';
    result: string;
}


export default function TopMenu() {
    const [apiKey, setApiKey] = useState('');
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const [githubUrl, setGithubUrl] = useState('');
    const [analysisType, setAnalysisType] = useState('security');

    const [reportId, setReportId] = useState('');
    const [hasReportBeenCreated, setHasReportBeenCreated] = useState(false); // Track if the report has been created

    const { mutate: createReport } = api.report.createReport.useMutation({
        onSuccess: (data) => {
            console.log('Report created with name', data.name);
            setReportId(data.id); // Update reportId state
            setHasReportBeenCreated(true); // Update the state to reflect the report creation
        },
        onError: (error) => {
            console.error('Failed to create report:', error);
        },
    });

    const { mutate: updateReportNameById } = api.report.updateReportNameById.useMutation();

    useEffect(() => {
        // Check if user is signed in, user information is loaded, and the report hasn't been created yet
        if (userLoaded && isSignedIn && user && !hasReportBeenCreated) {
            createReport({ userId: user.id });
        }
    }, [userLoaded, isSignedIn, user, hasReportBeenCreated]); // Dependencies

    const handleApiCall = async () => {
        if (!reportId) {
            console.error("No report ID available");
            return;
        }

        try {
            if (githubUrl === '') {
                console.error("No GitHub URL provided");
                return;
            }
            void router.push(`/reports/${reportId}`);

            updateReportNameById({ id: reportId, name: githubUrl.split('/').pop() ?? 'report', analysisType: analysisType });

            const response = await fetch("http://localhost:8000/generate-report", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reportId: reportId, url: githubUrl, analysisType: analysisType, apiKey: apiKey }),
              });

            if (!response.ok) {
                throw new Error('Failed to call API');
            }

            const data: ApiResponse = await response.json() as ApiResponse;
            console.log(data);
        } catch (error) {
            console.error("API call error:", error);
        }
    };

    return (
        <div className="flex justify-end items-center p-4">
            {userLoaded && isSignedIn ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter GitHub Repo URL"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="border-2 border-white text-black py-2 px-4 rounded focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ marginRight: '1rem' }}
                    />
                    <input
                    type="text"
                    placeholder="Enter Claude API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="border-2 border-white text-black py-2 px-4 rounded focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ marginRight: '1rem' }}
                    />

                    <select
                        className="border-2 border-white text-black py-2 px-4 rounded focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ marginRight: '1rem' }}
                        onChange={(e) => setAnalysisType(e.target.value)}
                    >
                        <option value="security">Security</option>
                        <option value="performance">Performance</option>
                        <option value="maintainability">Maintainability</option>
                    </select>


                    <button
                        className="border-2 border-white text-white py-2 px-4 rounded hover:bg-purple-500 transition-colors"
                        onClick={handleApiCall}
                    >
                        Generate Analysis
                    </button>
                </>
            ) : (
                <SignInButton />
            )}
        </div>
    );
}
