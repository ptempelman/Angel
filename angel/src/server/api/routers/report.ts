import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const reportRouter = createTRPCRouter({

    createReport: publicProcedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.report.create({
                data: {
                    userId: input.userId,
                },
            });
        }),

    // updateReport: publicProcedure
    //     .input(z.object({ id: z.string(), userId: z.string() }))
    //     .mutation(async ({ ctx, input }) => {
    //         return ctx.db.report.update({
    //             where: { id: input.id },
    //             data: {
    //                 userId: input.userId,
    //             },
    //         });
    //     }),

    getReportsByUser: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.report.findMany({
                where: { userId: input.userId },
            });
        }),

    updateReportNameById: publicProcedure
        .input(z.object({ id: z.string(), name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.report.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                },
            });
        }),

});