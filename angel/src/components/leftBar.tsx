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
    const currentReportId = router.query.reportId;

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
                                    <li
                                        key={report.name}
                                        className={`h-20 border border-white flex flex-col justify-between px-4 py-2 relative cursor-pointer transition-colors hover:bg-white hover:text-black ${report.id === currentReportId ? 'bg-white text-black' : 'bg-black text-white'
                                            }`} // Apply inverted colors if the current report matches
                                        onClick={() => router.push(`/reports/${report.id}`)}
                                        title={new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} // Full date as tooltip
                                    >
                                        <span className="self-start ml-2">{report.name}</span> {/* Report Name */}
                                        <div className="flex justify-between items-end w-full"> {/* Container for bottom elements */}
                                            <div className={`py-2 px-4 rounded-md text-xs font-semibold self-end ${report.analysisType === 'security' ? 'bg-yellow-500' : report.analysisType === 'performance' ? 'bg-blue-500' : 'bg-purple-500'
                                                }`} style={{ minWidth: 'fit-content' }}>
                                                {report.analysisType}
                                            </div>
                                            <span className="text-xs self-end" style={{ opacity: 0.75 }}>
                                                {new Date(report.createdAt).toLocaleDateString('en-US')} {/* MM/DD/YY format */}
                                            </span>
                                        </div>
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