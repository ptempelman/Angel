import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import LeftBar from "~/components/leftBar";
import TopBar from "~/components/topBar";
import TopMenu from "~/components/topMenu";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [repositories, setRepositories] = useState(null);

  useEffect(() => {
    if (isSignedIn && !userLoaded) {
      fetchRepositories();
    }
  }, [isSignedIn, userLoaded]);

  const fetchRepositories = async () => {
    try {
      const token = await getToken();
      const response = await fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const repos = await response.json();
      setRepositories(repos);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  const handleRepositorySelection = (repository) => {
    console.log("Selected repository:", repository);
    // Perform actions with the selected repository
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopBar />
      <div className="flex min-h-screen">
        <LeftBar />
        <div className="flex-grow">
          <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-black to-[#15162c]">
            <div className="w-3/4 p-4 flex justify-center mt-8">
              <h1 className="text-3xl font-bold text-white">Welcome {user?.fullName}</h1>
            </div>
            <TopMenu />
            {/* Display repositories if fetched */}
            {repositories !== null && repositories.length > 0 && (
              <div className="w-3/4 p-4">
                <h2 className="text-xl font-bold text-white mt-4">Select a Repository:</h2>
                <ul>
                  {repositories.map((repo) => (
                    <li key={repo.id}>
                      <button onClick={() => handleRepositorySelection(repo)} className="text-white">{repo.full_name}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
