import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from "~/utils/api";

export default function TopMenu() {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const [githubUrl, setGithubUrl] = useState('');
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
            router.push(`/reports/${reportId}`);

            const response = await fetch("http://localhost:8000/generate-report", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reportId: reportId, url: githubUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to call API');
            }

            const data = await response.json();
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
                    <button
                        className="border-2 border-white text-white py-2 px-4 rounded hover:bg-white hover:text-black transition-colors"
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
