import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from 'react';
import { api } from "~/utils/api";

export default function TopMenu() {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    const [githubUrl, setGithubUrl] = useState('');
    const [reportId, setReportId] = useState(''); // Use state for reportId

    const { mutate: createReport } = api.report.createReport.useMutation({
        onSuccess: (data) => {
            console.log('Report created with name', data.name);
            setReportId(data.id); // Update reportId state
        },
        onError: (error) => {
            console.error('Failed to create report:', error);
        },
    });

    if (user) {
        createReport({ userId: user.id });
    }

    const handleApiCall = async () => {
        if (!reportId) {
            console.error("No report ID available");
            return;
        }

        try {
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
