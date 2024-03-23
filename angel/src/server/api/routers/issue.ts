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

    getIssuesByReport: publicProcedure
        .input(z.object({ reportId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.issue.findMany({
                where: { reportId: input.reportId },
            });
        }),


});