import { Button, TextField } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";

const Login: React.FC<{
  onSave: (connectionString: string) => void;
}> = ({ onSave }) => {
  const [connectionString, setConnectionString] = useState("");

  const save = () => {
    onSave(connectionString);
  };

  return (
    <div className="flex items-center gap-5">
      <TextField
        required
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
    </div>
  );
};

export default Login;
