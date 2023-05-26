import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { postgresqlRouter } from "./routers/postgresql/postgresql";
import { mongodbRouter } from "~/server/api/routers/mongodb/mongodb";
import { neo4jRouter } from "~/server/api/routers/neo4j/neo4j";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    example: exampleRouter,
    postgressql: postgresqlRouter,
    mongodb: mongodbRouter,
    neo4j: neo4jRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
