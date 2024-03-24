import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const issueRouter = createTRPCRouter({

    createIssue: publicProcedure
        .input(z.object({ reportId: z.string(), status: z.string(), filename: z.string(), description: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.issue.create({
                data: {
                    reportId: input.reportId,
                    status: input.status,
                    filename: input.filename,
                    description: input.description,
                },
            });
        }),

    updateIssueByFilename: publicProcedure
        .input(z.object({ reportId: z.string(), filename: z.string(), status: z.string(), description: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Find the issue by filename and reportId
            const issue = await ctx.db.issue.findFirst({
                where: { reportId: input.reportId, filename: input.filename },
            });

            // if the issue is not found, return null
            if (!issue) return null;

            // Update the issue
            return ctx.db.issue.update({
                where: { id: issue.id },
                data: {
                    status: input.status,
                    description: input.description,
                },
            });
        }),

    getIssuesByReport: publicProcedure
        .input(z.object({ reportId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.issue.findMany({
                where: { reportId: input.reportId },
            });
        }),


});