import { NextPage } from "next";
import Layout from "~/components/layout/layout";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const MongodbQueryDetails: NextPage = () => {
  const router = useRouter();

  const [isEnabledQuerySpecificResults, setIsEnabledQuerySpecificResults] = React.useState(false);
  const [filterName, setFilterName] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');

  const { connectionString, databaseName, collectionName, isEnabledQueryResults } = router.query;

  const queryResults = api.mongodb.getDatabaseResults.useQuery( {connectionString, databaseName, collectionName}, {enabled: Boolean(isEnabledQueryResults)});
  const querySpecificResults = api.mongodb.getSpecificDatabaseResults.useQuery( {connectionString, databaseName, collectionName, filterName, filterValue}, {enabled: isEnabledQuerySpecificResults});

  const onFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value)
  }

  const onFilterNameChange = (event: SelectChangeEvent<typeof filterName>) => {
    setFilterName(event.target.value);
  }

  const selectSpecificResults = () => {
    setIsEnabledQuerySpecificResults(true);
  }
/*  console.log(connectionString, databaseName, collectionName)*/

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            MongoDB Query Builder
          </h1>
          <h2>All results:</h2>
          <ul>
            {queryResults.data?.map((item: any) => {
              return <li key={item}>{JSON.stringify(item)}</li>
            })}
          </ul>

          <div>
            <Select
              value={filterName}
              placeholder={'Select filter name'}
              onChange={onFilterNameChange}
              sx={{ minWidth: 120 }}>
              {queryResults.data?.map((resultKey) => (
                /*TODO Find all keys (https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKeys/#mongodb-method-KeyVault.getKeys)*/
                <MenuItem
                  key={resultKey._id}
                  value={resultKey._id}>
                  {resultKey._id}
                </MenuItem>
              ))}
            </Select>
            <TextField variant="outlined" label="Filter value" value={filterValue}
                       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                         onFilterValueChange(event)
                       }}>
            </TextField>

            <Button onClick={ () => {
               selectSpecificResults;
            }} variant="outlined">
              Select specific results
              <KeyboardArrowRightIcon />
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MongodbQueryDetails;