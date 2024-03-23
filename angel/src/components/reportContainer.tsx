import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import fakeData from "../../one_file_analysis_report.json";
import IssueBlock from "./issueBlock";


export default function ReportContainer({ reportId }: { reportId: string }) {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();

    if (!user) {
        return <></>;
    }

    const issues = api.issue.getIssuesByReport.useQuery({ reportId: reportId });

    return (
        <div className="w-4/6">
            {issues.data?.map((issue) => (
                <IssueBlock key={issue.id} filename={issue.filename} descriptions={fakeData} />
            ))}
        </div>

    );
}