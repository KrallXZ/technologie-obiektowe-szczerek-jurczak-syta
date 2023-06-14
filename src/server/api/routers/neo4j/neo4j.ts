import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { Connection } from 'cypher-query-builder';

export const neo4jRouter = createTRPCRouter({
    getDatabaseList: publicProcedure
        .input(
            z.object({
                connectionString: z.string(),
                usernameValue: z.string(),
                passwordValue: z.string(),
            })
        )
        .query(async ({ input: { connectionString, usernameValue, passwordValue } }) => {
            try {
                const db = new Connection(connectionString, {
                    username: usernameValue,
                    password: passwordValue,
                });

                return db;
            } catch (error) {
                console.log(error);
            }
        }),
});

export type neo4jRouter = typeof neo4jRouter;
