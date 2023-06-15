import {
  type SelectChangeEvent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";

const QueryBuilderSelect: React.FC<{
  tableData: string[];
  onSelect: (value: string) => void;
}> = ({ tableData, onSelect }) => {
  const [table, setTable] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setTable(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel>Table</InputLabel>
      <Select sx={{ minWidth: 120 }} value={table} onChange={handleChange}>
        {tableData.map((tableName) => (
          <MenuItem key={tableName} value={tableName}>
            {tableName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default QueryBuilderSelect;
