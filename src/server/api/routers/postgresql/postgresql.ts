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
  [key: string]: any;
}

const createDb = (connectionString: string) => {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
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
  executeQuery: publicProcedure
    .input(
      z.object({
        connectionString: z.string(),
        joins: z.array(
          z.object({
            id: z.string(),
            tableName: z.string(),
            columnName: z.string(),
            foreignColumnName: z.string(),
          })
        ),
        wheres: z.array(
          z.object({
            id: z.string(),
            columnName: z.string(),
            value: z.string(),
          })
        ),
        selectedColumns: z.array(z.string()),
        tableName: z.string(),
      })
    )
    .mutation(
      async ({
        input: { connectionString, joins, wheres, selectedColumns, tableName },
      }) => {
        const db = createDb(connectionString);

        const withJoins = joins.reduce((query, join) => {
          const { tableName, columnName, foreignColumnName } = join;
          return query.innerJoin(tableName, columnName, foreignColumnName);
        }, db.selectFrom(tableName));

        const withWheres = wheres.reduce(
          (query, where) => query.where(where.columnName, "=", where.value),
          withJoins
        );

        const query = withWheres.select(selectedColumns.map((column) => `${column} as ${column}`));

        const result = await query.execute();

        console.log(result)

        return result;
      }
    ),
});

export type postgresqlRouter = typeof postgresqlRouter;
