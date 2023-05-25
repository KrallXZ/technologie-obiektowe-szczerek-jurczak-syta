import { Button, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { CollectionInfo } from "mongodb";

const LoginMongoDB: React.FC = () => {
  const [connectionString, setConnectionString] = React.useState('');
  const [databaseName, setDatabaseName] = React.useState('');
  const [collectionName, setCollectionName] = React.useState('');

  const [isEnabledQueryDatabase, setIsEnabledQueryDatabase] = React.useState(false);
  const [isEnabledQueryCollection, setIsEnabledQueryCollection] = React.useState(false);

  const queryDatabase = api.mongodb.getDatabaseList.useQuery( connectionString, {enabled: isEnabledQueryDatabase});
  const queryCollection = api.mongodb.getCollectionList.useQuery( {connectionString, databaseName}, {enabled: isEnabledQueryCollection});

  const router = useRouter();

  const connectToMongoDB = async () => {
    await router.push({
      pathname: '/mongodb/query-details',
      query: {connectionString: connectionString, databaseName: databaseName, collectionName: collectionName, isEnabledQueryResults: true}
    })
  }
  const onConnectionStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConnectionString(event.target.value)
    setIsEnabledQueryDatabase(true);
  }

  const onDatabaseChange = (event: SelectChangeEvent<typeof databaseName>) => {
    setDatabaseName(event.target.value);
    setIsEnabledQueryCollection(true);
  };

  const onCollectionChange = (event: SelectChangeEvent<typeof databaseName>) => {
    setCollectionName(event.target.value);
  };

  return (
    <>
    <div className="flex items-center gap-5">
      <TextField required variant="outlined" label="Connection string" value={connectionString}
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                   onConnectionStringChange(event)
                 }}>
      </TextField>

      <Select
      value={databaseName}
      placeholder={'Select database'}
      onChange={onDatabaseChange}
      sx={{ minWidth: 120 }}>
        {queryDatabase.data?.databases.map((databaseName) => (
          <MenuItem
          key={databaseName.name}
          value={databaseName.name}>
            {databaseName.name}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={collectionName}
        placeholder={'Select collection'}
        onChange={onCollectionChange}
        sx={{ minWidth: 120 }}>
        {queryCollection.data?.map((collectionName: CollectionInfo) => (
          <MenuItem
            key={collectionName.name}
            value={collectionName.name}>
            {collectionName.name}
          </MenuItem>
        ))}
      </Select>

      <Button onClick={ async () => {
            await connectToMongoDB();
      }} variant="outlined">
        Connect to
          database
         <KeyboardArrowRightIcon />
      </Button>
    </div>
      <p>Example: mongodb://127.0.0.1:27017</p>
    </>
  );
};

export default LoginMongoDB;