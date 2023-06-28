import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Connection } from "cypher-query-builder";

type Result = {
  item: { labels: string[]; properties: { [key: string]: any } };
}[];

export const neo4jRouter = createTRPCRouter({
  getDatabaseList: publicProcedure
    .input(
      z.object({
        connectionString: z.string(),
        usernameValue: z.string(),
        passwordValue: z.string(),
      })
    )
    .query(({ input: { connectionString, usernameValue, passwordValue } }) => {
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
    .query(({ input: { connectionString, usernameValue, passwordValue } }) => {
      try {
        const db = new Connection(connectionString, {
          username: usernameValue,
          password: passwordValue,
        });

        return db.raw("call db.labels()").run() as unknown as {
          label: string;
        }[];
      } catch (error) {
        console.log(error);

        return [];
      }
    }),

  getDatabaseResults: publicProcedure
    .input(
      z.object({
        connectionString: z.string(),
        usernameValue: z.string(),
        passwordValue: z.string(),
        nodeName: z.string(),
        filters: z.array(
          z.object({ columnName: z.string(), value: z.string() })
        ),
      })
    )
    .query(
      ({
        input: {
          connectionString,
          usernameValue,
          passwordValue,
          nodeName,
          filters,
        },
      }) => {
        try {
          const db = new Connection(connectionString, {
            username: usernameValue,
            password: passwordValue,
          });

          const conditions = Object.fromEntries(
            filters
              .filter((filter) => filter.columnName !== "")
              .map((filter) => [filter.columnName, filter.value])
          );

          const query = db
            .matchNode("item", nodeName, conditions)
            .return("item");

          return query.run() as unknown as Result;
        } catch (error) {
          return [];
        }
      }
    ),
});

export type neo4jRouter = typeof neo4jRouter;
