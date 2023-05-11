import { Button, TextField } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { api } from "~/utils/api";
import React from "react";


const Login: React.FC = () => {
  {/* TODO Repair href for other databases*/
  }
  const [connectionString, setConnectionString] = React.useState('');
  const mutation = api.postgressql.connect.useMutation();
  const connectToPostgres = () => {
    mutation.mutate(connectionString);
  }

  return (
    <div className="flex items-center gap-5">
      <TextField required variant="outlined" label="Connection string" value={connectionString}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setConnectionString(event.target.value);
        }}></TextField>
      <Button onClick={() => {
        connectToPostgres()
      }} variant="outlined">Connect to
        database <KeyboardArrowRightIcon /></Button>

    </div>
  );
};

export default Login;