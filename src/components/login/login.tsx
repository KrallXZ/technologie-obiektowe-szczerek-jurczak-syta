import { Button, TextField } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Login: React.FC = () => {
  {/* TODO Repair href for other databases*/
  }
  return (
    <div className="flex items-center gap-5">
      <TextField required variant="outlined" label="Connection string"></TextField>
      <Button href="/postgresql/query-builder-postgres" variant="outlined">Connect to
        database <KeyboardArrowRightIcon /></Button>
    </div>
  );
};

export default Login;