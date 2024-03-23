import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from 'react';

export default function TopMenu() {
    const { isLoaded: userLoaded, isSignedIn } = useUser();
    const [githubUrl, setGithubUrl] = useState('');

    // Function to trigger API call
    const handleApiCall = async () => {
        try {
            const response = await fetch("http://localhost:8000/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: githubUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to call API');
            }

            // Handle response data here
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
