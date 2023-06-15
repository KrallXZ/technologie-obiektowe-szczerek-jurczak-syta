import { Button, TextField } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";

import { useLocalStorage } from "@mantine/hooks";

const LoginPostgres: React.FC<{
  onSave: (connectionString: string) => void;
}> = ({ onSave }) => {
  const [localStorageConnectionString, setLocalStorageConnectionString] =
    useLocalStorage<string>({
      key: "postgres-connection-string",
      defaultValue: "",
    });

  const [connectionString, setConnectionString] = useState("");

  const save = () => {
    onSave(connectionString);
    setLocalStorageConnectionString(connectionString);
  };

  const loadFromLocalStorage = () => {
    setConnectionString(localStorageConnectionString);
    onSave(localStorageConnectionString);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-5">
        <TextField
          required
          sx={{ minWidth: "500px" }}
          variant="outlined"
          label="Connection string"
          value={connectionString}
          onChange={(event) => {
            setConnectionString(event.target.value);
          }}
        ></TextField>
        <Button
          onClick={() => {
            save();
          }}
          variant="outlined"
        >
          Connect to database <KeyboardArrowRightIcon />
        </Button>
        {localStorageConnectionString ? (
          <Button onClick={loadFromLocalStorage} variant="outlined">
            Load last
          </Button>
        ) : null}
      </div>
      <div className="italic">Example: postgres://localhost:5433/karol</div>
    </div>
  );
};

export default LoginPostgres;
