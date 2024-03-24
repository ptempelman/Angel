// index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import HomePage from "~/components/homePage";
import Footer from "~/components/footer";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  // Redirect to signInPage.tsx if the user is signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/signInPage');
    }
  }, [isSignedIn, router]);

  // Render the HomePage if not signed in
  return (
    <>
      <Head>
        <title>Angel.AI</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
      <Footer />
    </>
  );
}
