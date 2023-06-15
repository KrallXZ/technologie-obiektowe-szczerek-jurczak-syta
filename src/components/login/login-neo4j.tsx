import { Button, TextField } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const LoginNeo4j: React.FC = () => {
  const [connectionString, setConnectionString] = React.useState('');
  const [usernameValue, setUsernameValue] = React.useState('');
  const [passwordValue, setPasswordValue] = React.useState('');

  const [isEnabledQueryDatabase, setIsEnabledQueryDatabase] = React.useState(false);

  const queryDatabase = api.neo4j.getDatabaseList.useQuery( {connectionString: connectionString, usernameValue: usernameValue, passwordValue: passwordValue}, {enabled: isEnabledQueryDatabase});

  const router = useRouter();

  const connectToNeo4j =  async () => {
     setIsEnabledQueryDatabase(true);
    await router.push({
      pathname: '/neo4j/query-details',
      query: {connectionString: connectionString, usernameValue: usernameValue, passwordValue: passwordValue, isEnabledQueryResults: true}
    })
  }

  return (
    <>
      <div className="flex items-center gap-5">
        <TextField required variant="outlined" label="Connection string" value={connectionString}
                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setConnectionString(event.target.value);
                   }}>
        </TextField>

        <TextField required variant="outlined" label="Username value" value={usernameValue}
                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                     setUsernameValue(event.target.value);
                   }}>
        </TextField>

        <TextField required variant="outlined" label="Password value" value={passwordValue}
                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                     setPasswordValue(event.target.value);
                   }}>
        </TextField>

        <Button onClick={ async () => {
          await connectToNeo4j();
        }} variant="outlined">
          Connect to
          database
          <KeyboardArrowRightIcon />
        </Button>
      </div>
      <p>Example: bolt://127.0.0.1:7687</p>
    </>
  );
};

export default LoginNeo4j;