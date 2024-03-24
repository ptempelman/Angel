import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { api } from "~/utils/api";

interface Issue {
  title: string;
  body: string;
  filename: string;
}

interface TopMenuProps {
  onAnalysisResults: (results: Issue[]) => void;
}

export default function TopMenu({ onAnalysisResults }: TopMenuProps) {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [githubUrl, setGithubUrl] = useState('');
  const [reportId, setReportId] = useState('');
  const [hasReportBeenCreated, setHasReportBeenCreated] = useState(false);

  const { mutate: createReport } = api.report.createReport.useMutation({
    onSuccess: (data) => {
      console.log('Report created with name', data.name);
      setReportId(data.id);
      setHasReportBeenCreated(true);
    },
    onError: (error) => {
      console.error('Failed to create report:', error);
    },
  });

  const { mutate: updateReportNameById } = api.report.updateReportNameById.useMutation();

  useEffect(() => {
    if (userLoaded && isSignedIn && user && !hasReportBeenCreated) {
      createReport({ userId: user.id });
    }
  }, [userLoaded, isSignedIn, user, hasReportBeenCreated, createReport]);

  const handleApiCall = async () => {
    if (!reportId) {
      console.error("No report ID available");
      return;
    }

    try {
      router.push(`/reports/${reportId}`);
      updateReportNameById({ id: reportId, name: githubUrl.split('/').pop() || 'report' });

      const response = await fetch("http://localhost:8000/generate-report", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId: reportId, url: githubUrl }),
      });

      if (!response.ok) {
        console.error('API call failed:', response.status, await response.text());
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      const issues = [];
      for (const [file, issuesString] of Object.entries(data)) {
        try {
          const fileIssues = JSON.parse(issuesString);
          if (Array.isArray(fileIssues)) {
            fileIssues.forEach(issue => {
              const [severity, note] = Object.entries(issue)[0];
              issues.push({
                title: note,
                body: note,
                filename: file,
              });
            });
          }
        } catch (error) {
          console.error(`Error parsing issues for file ${file}:`, error);
        }
      }

      if (issues.length === 0) {
        console.error('No valid issues found in the response data');
        return;
      }

      onAnalysisResults(issues);
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
