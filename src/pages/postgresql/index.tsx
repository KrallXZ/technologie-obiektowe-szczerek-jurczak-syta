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

import { v4 as uuidv4 } from "uuid";
import QueryBuilderWhere from "~/components/query-builder-where/query-builder-where";

type Join = {
  id: string; // uuidv4
  tableName: string;
  columnName: string;
  foreignColumnName: string;
};

type Where = {
  id: string; // uuidv4
  columnName: string;
  value: string;
};

const Postgresql: NextPage = () => {
  const [connectionString, setConnectionString] = useState("");
  const [tableName, setTableName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [joins, setJoins] = useState<Join[]>([]);
  const [wheres, setWheres] = useState<Where[]>([]);

  const selectedTables = useMemo(() => {
    return [tableName, ...joins.map((join) => join.tableName)].filter(
      (value) => value !== ""
    );
  }, [tableName, joins]);

  const schemaQuery = api.postgressql.getSchema.useQuery(connectionString, {
    enabled: Boolean(connectionString),
  });

  const queryResult = api.postgressql.executeQuery.useMutation();

  const onExecuteQuery = () => {
    queryResult.mutate({ connectionString, selectedColumns, joins, wheres, tableName });
  };

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
        {schemaQuery.isError ? <div>{schemaQuery.error.message}</div> : null}

        {schemaQuery.data ? (
          <div className="flex flex-col gap-5">
            <QueryBuilderHeader />
            <div className="flex flex-row items-center gap-5">
              <span>SELECT</span>
              <QueryBuilderMultiSelect
                onSelect={(selectedColumns: string[]) => {
                  setSelectedColumns(selectedColumns);
                }}
                tableData={tables}
                tableNames={selectedTables}
              />
              <span>FROM</span>
              <QueryBuilderSelect
                onSelect={(selectedTable: string) => {
                  setTableName(selectedTable);
                }}
                tableData={Object.keys(tables)}
              />
            </div>
            {joins.map(({ id }) => (
              <div key={id} style={{ marginLeft: 50 }}>
                <QueryBuilderJoin
                  key={id}
                  onSelect={(joinData: {
                    tableName: string;
                    columnName: string;
                    foreignColumnName: string;
                  }) => {
                    setJoins((joins) =>
                      joins.map((join) => {
                        if (join.id === id) {
                          return { id, ...joinData };
                        }

                        return join;
                      })
                    );
                  }}
                  tableData={tables}
                  tableNames={selectedTables}
                  onDelete={() => {
                    setJoins((joins) => joins.filter((join) => join.id !== id));
                  }}
                />
              </div>
            ))}
            {wheres.map(({ id }) => (
              <div key={id} style={{ marginLeft: 50 }}>
                <QueryBuilderWhere
                  key={id}
                  onSelect={(whereData: {
                    columnName: string;
                    value: string;
                  }) => {
                    setWheres((wheres) =>
                      wheres.map((where) => {
                        if (where.id === id) {
                          return { id, ...whereData };
                        }

                        return where;
                      })
                    );
                  }}
                  tableData={tables}
                  tableNames={selectedTables}
                  onDelete={() => {
                    setWheres((wheres) =>
                      wheres.filter((where) => where.id !== id)
                    );
                  }}
                />
              </div>
            ))}
            <div className="flex justify-center gap-5">
              <Button
                onClick={() => {
                  setJoins((joins) => [
                    ...joins,
                    {
                      id: uuidv4(),
                      tableName: "",
                      columnName: "",
                      foreignColumnName: "",
                    },
                  ]);
                }}
                variant="outlined"
              >
                Add join
              </Button>
              <Button
                onClick={() => {
                  setWheres((wheres) => [
                    ...wheres,
                    {
                      id: uuidv4(),
                      columnName: "",
                      value: "",
                    },
                  ]);
                }}
                variant="outlined"
              >
                Add where
              </Button>
              <Button onClick={() => onExecuteQuery()} variant="outlined">
                Execute
              </Button>
            </div>
            <div>
              {queryResult.isLoading ? (
                <div>Loading...</div>
              ) : queryResult.data ? (
                <div>{JSON.stringify(queryResult.data)}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Postgresql;
