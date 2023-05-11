import { Button, TextField } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import { api } from "~/utils/api";

const LoginMongoDB: React.FC = () => {
  const [connectionString, setConnectionString] = React.useState('');
  const [databaseName, setDatabaseName] = React.useState('');
  const [collectionName, setCollectionName] = React.useState('');
  const [isEnabled, setIsEnabled] = React.useState(false);
  const query = api.mongodb.connect.useQuery({ connectionString, databaseName, collectionName }, {enabled: isEnabled});
  const connectToMongoDB = () => {
    setIsEnabled(true);
  }

  console.log(query.data);

  return (
    <div className="flex items-center gap-5">
      <TextField required variant="outlined" label="Connection string" value={connectionString}
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                   setConnectionString(event.target.value);
                 }}>
      </TextField>

      <TextField required variant="outlined" label="Database string" value={databaseName}
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                   setDatabaseName(event.target.value);
                 }}>
      </TextField>

      <TextField required variant="outlined" label="Collection string" value={collectionName}
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                   setCollectionName(event.target.value);
                 }}>
      </TextField>

      <Button onClick={ () => {
        connectToMongoDB()
      }} variant="outlined">Connect to
        database <KeyboardArrowRightIcon /></Button>

    </div>
  );
};

export default LoginMongoDB;