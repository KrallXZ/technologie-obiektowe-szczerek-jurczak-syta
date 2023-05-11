import knex from 'knex';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

let db: any;

export const postgresqlRouter = createTRPCRouter({
    connect: publicProcedure.input(z.string()).mutation(async (connect) => {
        const { input } = connect;
        db = await knex({
            client: 'pg',
            connection: input,
        });
        return;
    }),
});

export type postgresqlRouter = typeof postgresqlRouter;
