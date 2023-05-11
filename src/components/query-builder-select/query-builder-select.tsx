import { SelectChangeEvent, Select, MenuItem } from "@mui/material";
import React from "react";

const QueryBuilderSelect: React.FC<{
    tableData: string[], 
    onSelect: (value: string) => void;
}> = ({tableData,onSelect}) => {
    const [table, setTable] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setTable(event.target.value as string);
        onSelect(event.target.value as string)
    };


  return (
        <Select
        sx={{ minWidth: 120 }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={table}
          onChange={handleChange}
        >
            {tableData.map((tableName) => (
                <MenuItem key={tableName} value={tableName}>{tableName}</MenuItem >
            ))}
        </Select>
  );
};

export default QueryBuilderSelect;