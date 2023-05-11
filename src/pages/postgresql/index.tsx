import { type NextPage } from "next";
import Layout from "../../components/layout/layout";
import Login from "../../components/login/login";
import { useMemo, useState } from "react";
import { api } from "~/utils/api";
import { pipe, groupBy } from "remeda";

const Postgresql: NextPage = () => {
  const [connectionString, setConnectionString] = useState("");

  const schemaQuery = api.postgressql.getSchema.useQuery(connectionString, {
    enabled: Boolean(connectionString),
  });

  const tables = useMemo(() => {
    if (!schemaQuery.data) return {};

    return pipe(
      schemaQuery.data,
      groupBy((table) => table.table_name)
    );
  }, [schemaQuery.data]);

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          PostgreSQL
        </h1>
        <Login
          onSave={(connectionString) => {
            setConnectionString(connectionString);
          }}
        />
        {schemaQuery.isLoading && schemaQuery.isFetching ? <div>Loading...</div> : null}
        {schemaQuery.isError ? (
          <div>{schemaQuery.error.message}</div>
        ) : (
          <ul>
            {Object.keys(tables).map((tableName) => (
              <li key={tableName}>
                <strong>{tableName}</strong>
                <ul>
                  {tables[tableName]!.map((column) => (
                    <li key={column.column_name}>
                      {column.column_name}: {column.udt_name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Postgresql;
