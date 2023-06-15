import { NextPage } from "next";
import Layout from "~/components/layout/layout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { api } from "~/utils/api";

const Neo4jQueryDetails: NextPage = () => {
  const router = useRouter();

  const [isEnabledQuerySpecificResults, setIsEnabledQuerySpecificResults] = React.useState(false);
  const [nodeName, setNodeName] = React.useState('');
  const [nodePropertyArray, setNodePropertyArray] = React.useState([]);

  const { connectionString, usernameValue, passwordValue, isEnabledQueryResults } = router.query;

  const queryNodes = api.neo4j.getDatabaseNodes.useQuery( {connectionString, usernameValue, passwordValue}, {enabled: Boolean(isEnabledQueryResults)});
  const queryResults = api.neo4j.getDatabaseResults.useQuery( {connectionString, usernameValue, passwordValue, nodeName}, {enabled: isEnabledQuerySpecificResults});

  const onNodeNameChange = (event: SelectChangeEvent<typeof nodeName>) => {
    setNodeName(event.target.value);
    selectSpecificResults();
  }

  const selectSpecificResults = () => {
    setIsEnabledQuerySpecificResults(true);
  }

  useEffect(() => {
    if (queryResults.data) {
      queryResults.data.map((item: any) => {
        Object.entries(item).forEach(([keyItem, valueItem]) => {
          Object.entries(valueItem['properties']).forEach(([keyItemProperty, valueItemProperty]) => {
            const nodePropertySet = new Set();
            nodePropertySet.add(keyItemProperty);

            const nodePropertiesArray = Array.from(nodePropertySet)

            setNodePropertyArray(nodePropertyArray => [...nodePropertyArray, ...nodePropertiesArray])
          })
        });
      })
    }
  }, [queryResults.data]);

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Neo4j Query Builder
          </h1>
          <h2>All results:</h2>
          <ul>
            {queryResults.data?.map((item: any) => {
              return <li key={item.identity}>{JSON.stringify(item)}</li>
            })}
          </ul>
          <div>
            <InputLabel>Select node name</InputLabel>
            <Select
              value={nodeName}
              onChange={onNodeNameChange}
              sx={{ minWidth: 200 }}>
              {
                queryNodes.data?.map((resultNode) => (
                  <MenuItem
                    key={resultNode}
                    value={resultNode.label}>
                    {resultNode.label}
                  </MenuItem>
              ))
              }
            </Select>

            <Select
              value={nodeName}
              placeholder={'Select node name'}
              sx={{ minWidth: 120 }}>
              {
                nodePropertyArray.map((resultNodeProperty) => (
                  <MenuItem
                    key={resultNodeProperty}
                    value={resultNodeProperty}>
                    {resultNodeProperty}
                  </MenuItem>
                  ))
              }
            </Select>

          </div>
        </div>
      </Layout>
    </>
  );
};

export default Neo4jQueryDetails;