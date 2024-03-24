import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { api } from "~/utils/api";


export default function LeftBar() {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    if (!userLoaded || !user) return (
        <div className="flex-none w-1/6 min-h-screen border-r bg-black border-white"></div>
    );

    const reports = api.report.getReportsByUser.useQuery({ userId: user?.id });

    return (
        <div className="flex-none w-1/6 min-h-screen border-r bg-black border-white">
            {!isSignedIn && <SignInButton />}
            {isSignedIn && (
                <div className="flex flex-col">
                    <div className="flex-1">
                        <ul>
                            {reports.data
                                ?.filter((report) => report.name !== null) // Filter out reports with a null name
                                .map((report) => (
                                    <li key={report.name} className="h-20 border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                                        onClick={() => router.push(`/reports/${report.id}`)}>
                                        {report.name}
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <button
                        className="h-20 border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                        onClick={() => router.push('/')}
                    >
                        +
                    </button>
                </div>
            )}
        </div>

    );
}