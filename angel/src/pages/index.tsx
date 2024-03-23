import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import TopBar from "~/components/topBar";
import fakeData from "../../one_file_analysis_report.json";

import IssueBlock from "~/components/issueBlock";
import TopMenu from "~/components/topMenu";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  api.user.createUser.useQuery({ id: user?.id, email: user?.primaryEmailAddress?.emailAddress ?? null, name: user?.fullName });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopBar />
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-black to-[#15162c]">
        {/* Sidebar for reports */}
        {/* <aside className="w-1/4 h-full overflow-y-auto bg-[#2e026d] p-4">
          {fakeData.map((report, index) => (
            <button key={index} className="w-full mb-2 rounded p-2 text-left text-white bg-purple-600 hover:bg-purple-700">
              {report.title || `Report ${index + 1}`}
            </button>
          ))}
        </aside> */}
        <TopMenu />

        {/* Main content area */}
        <div className="w-3/4 p-4">
          <h1 className="text-3xl font-bold text-white">Welcome {user?.fullName}</h1>
          {/* ... rest of your main content */}
          <IssueBlock filename="main.py" descriptions={fakeData} />
        </div>
      </main>
    </>
  );
}
