import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Connection } from "cypher-query-builder";

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

  getDatabaseNodes: publicProcedure
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

        return db.raw("call db.labels()").run();
      } catch (error) {
        console.log(error);
      }
    }),

  getDatabaseNodes: publicProcedure
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

        return db.raw("call db.labels()").run();
      } catch (error) {
        console.log(error);
      }
    }),

  getDatabaseResults: publicProcedure
    .input(
      z.object({
        connectionString: z.string(),
        usernameValue: z.string(),
        passwordValue: z.string(),
        nodeName: z.string(),
      })
    )
    .query(async ({ input: { connectionString, usernameValue, passwordValue, nodeName } }) => {
      try {
        const db = new Connection(connectionString, {
          username: usernameValue,
          password: passwordValue,
        });
        return db.matchNode("item", nodeName).return("item").run();
      } catch (error) {
        console.log(error);
      }
    }),

  getDatabaseSpecificResults: publicProcedure
    .input(
      z.object({
        connectionString: z.string(),
        usernameValue: z.string(),
        passwordValue: z.string(),
        nodeName: z.string(),
        nodeValue: z.string(),
        filterValue: z.string()
      })
    )
    .query(async ({ input: { connectionString, usernameValue, passwordValue, nodeName, nodeValue, filterValue } }) => {
      try {
        const db = new Connection(connectionString, {
          username: usernameValue,
          password: passwordValue,
        });
        return db.raw(`MATCH (item:${nodeName} {${nodeValue}: '${filterValue}'}) RETURN item`).run();
      } catch (error) {
        console.log(error);
      }
    }),
});

export type neo4jRouter = typeof neo4jRouter;
