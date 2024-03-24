// topMenu.tsx
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from "~/utils/api";
import IssueModal from './IssueModal';

interface Issue {
  filename: string;
  issue: string;
}

export default function TopMenu() {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [githubUrl, setGithubUrl] = useState('');
  const [reportId, setReportId] = useState('');
  const [hasReportBeenCreated, setHasReportBeenCreated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    if (showModal) {
      console.log("showModal state changed:", showModal);
    }
  }, [showModal]);

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
  }, [userLoaded, isSignedIn, user, hasReportBeenCreated]);

  const handleApiCall = async () => {
    if (!reportId) {
      console.error("No report ID available");
      return;
    }

    try {
      console.log("Navigating to report page");
      router.push(`/reports/${reportId}`);

      console.log("Updating report name");
      updateReportNameById({ id: reportId, name: githubUrl.split('/').pop() || 'report' });

      console.log("Sending API request");
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
      console.log("API response:", data);

      console.log("Transforming API response data");
      const issues: Issue[] = Object.entries(data).map(([filename, issueString]) => {
        const parsedIssues = JSON.parse((issueString as string).replace(/\\/g, ''));
        const issue = parsedIssues.length > 0 ? parsedIssues[0].critical || parsedIssues[0].moderate || parsedIssues[0].low : '';
        return {
          filename,
          issue,
        };
      });

      console.log("Transformed issues:", issues);

      console.log("Updating issues state");
      setIssues(issues);

      if (issues.length > 0) {
        console.log("Showing modal");
        setShowModal(true);
      }
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowModal(false);
  };

  const handlePushIssue = (issue: Issue) => {
    console.log("Pushing issue to repo:", issue);
    // Implement the logic to push the issue to the repo
  };

  return (
    <>
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
      {showModal && (
        <IssueModal issues={issues} onClose={handleCloseModal} onPushIssue={handlePushIssue} />
      )}
    </>
  );
}