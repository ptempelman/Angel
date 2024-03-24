import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const userRouter = createTRPCRouter({

    createUser: publicProcedure
        .input(z.object({ id: z.string().nullish(), email: z.string().nullish(), name: z.string().nullish() }))
        .query(async ({ ctx, input }) => {
            if (input.id && input.email) {
                const existingUser = await ctx.db.user.findUnique({
                    where: { id: input.id },
                });

                if (!existingUser) {
                    await ctx.db.user.create({
                        data: { id: input.id, email: input.email, name: input.name },
                    });
                }
                return { message: 'Sign-in successful' };
            } else {
                return { message: 'Sign-in failed' };
            }
        }),


});