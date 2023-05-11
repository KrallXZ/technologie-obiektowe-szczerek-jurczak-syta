import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

interface TablesTable {
  table_name: string;
  table_schema: string;
}

interface ColumnsTable {
  table_name: string;
  column_name: string;
  table_schema: string;
  udt_name: string;
}

interface Database {
  "information_schema.tables": TablesTable;
  "information_schema.columns": ColumnsTable;
}

const createDb = (connectionString: string) => {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      // @ts-ignore
      pool: new Pool({
        connectionString: connectionString,
      }),
    }),
  });

  return db;
};

export const postgresqlRouter = createTRPCRouter({
  getSchema: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const db = createDb(input);

      const res = await db
        .selectFrom("information_schema.tables")
        .innerJoin(
          "information_schema.columns",
          "information_schema.tables.table_name",
          "information_schema.columns.table_name"
        )
        .select([
          "information_schema.tables.table_name",
          "information_schema.columns.column_name",
          "information_schema.columns.udt_name",
        ])
        .where("information_schema.tables.table_schema", "=", "public")
        .where("information_schema.columns.table_schema", "=", "public")
        .execute();

      return res;
    } catch (e) {
      throw e;
    }
  }),
});

export type postgresqlRouter = typeof postgresqlRouter;
