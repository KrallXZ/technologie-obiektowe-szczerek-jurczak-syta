import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const exampleRouter = createTRPCRouter({
    hello: publicProcedure.query(() => {
        return {
            greeting: `Service is running smoothly`,
        };
    }),
});
