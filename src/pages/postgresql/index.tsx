import { type NextPage } from "next";
import Layout from "../../components/layout/layout";
import LoginPostgres from "../../components/login/login-postgres";
import { useMemo, useState } from "react";
import { api } from "~/utils/api";
import { groupBy, pipe } from "remeda";
import { Button } from "@mui/material";
import QueryBuilderHeader from "~/components/query-builder-header/query-builder-header";
import QueryBuilderJoin from "~/components/query-builder-join/query-builder-join";
import QueryBuilderMultiSelect from "~/components/query-builder-multiselect/query-builder-multiselect";
import QueryBuilderSelect from "~/components/query-builder-select/query-builder-select";

const Postgresql: NextPage = () => {
  const [connectionString, setConnectionString] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [joinsCounter, setJoinsCounter] = useState(0);

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
        <LoginPostgres
          onSave={(connectionString) => {
            setConnectionString(connectionString);
          }}
        />
        {schemaQuery.isLoading && schemaQuery.isFetching ? (
          <div>Loading...</div>
        ) : null}
        {schemaQuery.isError ? (
          <div>{schemaQuery.error.message}</div>
        ) : (
          <div className="flex flex-col">
            <QueryBuilderHeader />
            <div className="flex flex-row ">
              <span>SELECT</span>{" "}
              <QueryBuilderMultiSelect
                tableData={tables}
                tableName={selectedTable}
              />{" "}
              <span>FROM</span>{" "}
              <QueryBuilderSelect
                onSelect={(selectedTable: string) =>
                  setSelectedTable(selectedTable)
                }
                tableData={Object.keys(tables)}
              />
            </div>
            {Array(joinsCounter)
              .fill(0)
              .map((_, index) => (
                <QueryBuilderJoin
                  key={index}
                  tableData={tables}
                  tableName={selectedTable}
                />
              ))}
            <Button
              onClick={() => {
                setJoinsCounter((count) => count + 1);
              }}
            >
              ADD NEW JOIN
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Postgresql;
