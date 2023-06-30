import { type NextPage } from "next";
import Layout from "~/components/layout/layout";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { api } from "~/utils/api";
import { DataGrid } from "@mui/x-data-grid";

import { v4 as uuidv4 } from "uuid";

type Filter = {
  id: string;
  columnName: string;
  value: string;
};

const Neo4jQueryDetails: NextPage = () => {
  const router = useRouter();

  const [nodeName, setNodeName] = useState<string>("");

  const [filters, setFilters] = useState<Filter[]>([
    {
      id: uuidv4(),
      columnName: "",
      value: "",
    },
  ]);

  const { connectionString, usernameValue, passwordValue } = router.query as {
    connectionString: string;
    usernameValue: string;
    passwordValue: string;
  };

  const queryNodes = api.neo4j.getDatabaseNodes.useQuery(
    {
      connectionString,
      usernameValue,
      passwordValue,
    },
    {
      initialData: [],
    }
  );

  const allResults = api.neo4j.getDatabaseResults.useQuery(
    {
      connectionString,
      usernameValue,
      passwordValue,
      nodeName,
      filters: [],
    },
    {
      initialData: [],
      enabled: Boolean(nodeName),
    }
  );

  const queryResults = api.neo4j.getDatabaseResults.useQuery(
    {
      connectionString,
      usernameValue,
      passwordValue,
      nodeName,
      filters,
    },
    {
      initialData: [],
      enabled: Boolean(nodeName),
    }
  );

  const allResultData = allResults.data;
  const resultData = queryResults.data;

  const allColumns = useMemo(
    () => [
      ...new Set(
        allResultData
          .map((resultItem) => Object.keys(resultItem.item.properties))
          .flat()
      ),
    ],
    [allResultData]
  );

  const columns = useMemo(
    () =>
      [
        ...new Set(
          resultData
            .map((resultItem) => Object.keys(resultItem.item.properties))
            .flat()
        ),
      ].map((name) => ({
        field: name,
        headerName: name,
        width: 150,
      })),
    [resultData]
  );

  const rows = useMemo(
    () =>
      resultData.map((item, index) => ({
        ...item.item.properties,
        id: index,
      })),
    [resultData]
  );

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Neo4j Query Builder
          </h1>
          <InputLabel>Select node name</InputLabel>
          <Select
            value={nodeName}
            onChange={(event) => {
              setNodeName(event.target.value);
              setFilters([
                {
                  id: uuidv4(),
                  columnName: "",
                  value: "",
                },
              ]);
            }}
            sx={{ minWidth: 200 }}
          >
            {queryNodes.data?.map(({ label }) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
          {nodeName ? (
            <>
              <h2>Results:</h2>
              <DataGrid columns={columns} rows={rows} />
            </>
          ) : null}

          {nodeName ? (
            <div className="flex-col items-center flex gap-2">
              <InputLabel>Filters</InputLabel>
              {filters.map((filter) => (
                <div className="flex gap-2" key={filter.id}>
                  <Select
                    value={filter.columnName}
                    placeholder={"Select node value"}
                    onChange={(event) => {
                      setFilters((filters) =>
                        filters.map((_filter) => {
                          if (filter.id === _filter.id) {
                            return {
                              ...filter,
                              columnName: event?.target.value,
                            };
                          }

                          return _filter;
                        })
                      );
                    }}
                    sx={{ minWidth: 200 }}
                  >
                    {allColumns.map((column) => (
                      <MenuItem key={column} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>

                  <TextField
                    variant="outlined"
                    label="Filter value"
                    value={filter.value}
                    onChange={(event) => {
                      setFilters((filters) =>
                        filters.map((_filter) => {
                          if (filter.id === _filter.id) {
                            return {
                              ...filter,
                              value: event?.target.value,
                            };
                          }

                          return _filter;
                        })
                      );
                    }}
                  />
                  <Button
                    onClick={() => {
                      setFilters((filters) =>
                        filters.filter(({ id }) => id !== filter.id)
                      );
                    }}
                    variant="outlined"
                    color="error"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outlined"
                onClick={() =>
                  setFilters((filters) => [
                    ...filters,
                    {
                      id: uuidv4(),
                      columnName: "",
                      value: "",
                    },
                  ])
                }
              >
                Add filter
              </Button>
            </div>
          ) : null}
        </div>
      </Layout>
    </>
  );
};

export default Neo4jQueryDetails;
