import { type NextPage } from "next";
import Layout from "~/components/layout/layout";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { InputLabel, MenuItem, Select, type SelectChangeEvent, TextField } from "@mui/material";
import { api } from "~/utils/api";
import { DataGrid, type GridColDef, type GridRowsProp } from "@mui/x-data-grid";

const Neo4jQueryDetails: NextPage = () => {
  const router = useRouter();
  const [isEnabledQuerySpecificResults, setIsEnabledQuerySpecificResults] =
    React.useState(false);
  const [isEnabledQueryNodeResults, setIsEnabledQueryNodeResults] =
    React.useState(false);
  const [nodeName, setNodeName] = React.useState("");
  const [nodeValue, setNodeValue] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [specificRowValues, setSpecificRowValues] = React.useState<string[]>([]);
  const [rowValues, setRowValues] = React.useState<string[]>([]);
  const [nodePropertyArray, setNodePropertyArray] = React.useState([]);

  const {
    connectionString,
    usernameValue,
    passwordValue,
    isEnabledQueryResults,
  } = router.query;

  const queryNodes = api.neo4j.getDatabaseNodes.useQuery(
    { connectionString, usernameValue, passwordValue },
    { enabled: Boolean(isEnabledQueryResults) }
  );
  const queryResults = api.neo4j.getDatabaseResults.useQuery(
    { connectionString, usernameValue, passwordValue, nodeName },
    { enabled: Boolean(isEnabledQueryNodeResults) }
  );
  const querySpecificResults = api.neo4j.getDatabaseSpecificResults.useQuery(
    {
      connectionString,
      usernameValue,
      passwordValue,
      nodeName,
      nodeValue,
      filterValue,
    },
    { enabled: Boolean(isEnabledQuerySpecificResults) }
  );

  const onNodeNameChange = (event: SelectChangeEvent<typeof nodeName>) => {
    setNodeName(event.target.value);
    selectNodeResults(true);
    setRowValues([]);
  };

  const onNodeValueChange = (event: SelectChangeEvent) => {
    setNodeValue(event.target.value);
  };

  const onFilterNameChange = (event: SelectChangeEvent<typeof filterValue>) => {
    setFilterValue(event.target.value);
    selectSpecificResults(true);
    if (event.target.value == "") {
      setSpecificRowValues([]);
      selectNodeResults(true);
      selectSpecificResults(false);
    }
  };

  const selectNodeResults = (value) => {
    setIsEnabledQueryNodeResults(value);
  };

  const selectSpecificResults = (value) => {
    setIsEnabledQuerySpecificResults(value);
  };

  useEffect(() => {
    if (queryResults.data) {
      const nodeDuplicatedPropertiesArray = [];
      let nodePropertiesArray = [];

      queryResults.data.map((item: any) => {
        Object.entries(item).forEach(([keyItem, valueItem]) => {
          Object.entries(valueItem["properties"]).forEach(
            ([keyItemProperty, valueItemProperty]) => {
              nodeDuplicatedPropertiesArray.push(keyItemProperty);
            }
          );
        });
      });
      const nodePropertySet = new Set();
      nodeDuplicatedPropertiesArray.forEach((propertyName) =>
        nodePropertySet.add(propertyName)
      );

      nodePropertiesArray = Array.from(nodePropertySet);
      setNodePropertyArray(nodePropertiesArray);
    }
  }, [queryResults.data]);

  useEffect(() => {
    if (queryResults.data) {
      queryResults.data.map((item: any) => {
        Object.entries(item).forEach(([keyItem, valueItem]) => {
          console.log(JSON.stringify(valueItem));
          setRowValues((rowItems) => [...rowItems, valueItem]);
        });
      });
    }
  }, [queryResults.data]);

  useEffect(() => {
    if (querySpecificResults.data) {
      querySpecificResults.data.map((item: any) => {
        Object.entries(item).forEach(([keyItem, valueItem]) => {
          console.log(JSON.stringify(valueItem));
          setSpecificRowValues((rowItems) => [...rowItems, valueItem]);
        });
      });
    }
  }, [querySpecificResults.data]);

  const resultColumns: GridColDef[] = useMemo(
    () =>
      nodePropertyArray.map((column) => ({
        field: column,
        headerName: column,
        width: 150,
      })),
    [nodePropertyArray]
  );
  const resultRows: GridRowsProp = useMemo(
    () => rowValues.map((row: any, index) => ({ id: index, ...row.properties })) || [],
    [rowValues]
  );

  const specificResultRows: GridRowsProp = useMemo(
    () => specificRowValues.map((row: any, index) => ({ id: index, ...row.properties })) || [],
    [specificRowValues]
  );

  console.log(querySpecificResults.data?.length)

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Neo4j Query Builder
          </h1>
          <h2>All results:</h2>

          {querySpecificResults.data?.length >= 1 ? <DataGrid columns={resultColumns} rows={specificResultRows}></DataGrid> : <DataGrid columns={resultColumns} rows={resultRows}></DataGrid>}

          <div>
            <InputLabel>Select node name</InputLabel>
            <Select
              value={nodeName}
              onChange={onNodeNameChange}
              sx={{ minWidth: 200 }}
            >
              {queryNodes.data?.map((resultNode) => (
                <MenuItem key={resultNode} value={resultNode.label}>
                  {resultNode.label}
                </MenuItem>
              ))}
            </Select>
            <InputLabel>Select node property</InputLabel>
            <Select
              value={nodeValue}
              placeholder={"Select node value"}
              onChange={onNodeValueChange}
              sx={{ minWidth: 200 }}
            >
              {nodePropertyArray.map((resultNodeProperty) => (
                <MenuItem key={resultNodeProperty} value={resultNodeProperty}>
                  {resultNodeProperty}
                </MenuItem>
              ))}
            </Select>

            <TextField
              variant="outlined"
              label="Filter value"
              value={filterValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onFilterNameChange(event);
              }}
            ></TextField>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Neo4jQueryDetails;
