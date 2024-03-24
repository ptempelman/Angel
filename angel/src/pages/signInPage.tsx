import React from 'react';
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import LeftBar from "~/components/leftBar";
import TopBar from "~/components/topBar";
import TopMenu from "~/components/topMenu";

const AppHome = () => {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>Sign In - Angel.AI</title>
        <meta name="description" content="Sign in to Angel.AI" />
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
            {/* Add your sign-in logic and form here */}
          </main>
        </div>
      </div>
    </>
  );
};

export default AppHome;
