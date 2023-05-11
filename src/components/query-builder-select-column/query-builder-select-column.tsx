import { SelectChangeEvent, Select, Box, FormControl, InputLabel, MenuItem } from "@mui/material";
import React from "react";

const QueryBuilderSelectColumn: React.FC<{
    tableData: {[key: string]: {table_name: string;
        column_name: string;
        udt_name: string}[]}, tableName: string
}> = ({tableData,tableName}) => {
    const [column, setColumn] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setColumn(event.target.value as string);
    };

  return (
        <Select
        sx={{ minWidth: 120 }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={column}
          onChange={handleChange}
        >
            {tableName ? tableData[tableName]!.map((column) => (
            <MenuItem
              key={column.column_name}
              value={column.column_name}
            >
              {column.column_name}
            </MenuItem>
          )) : [] } 
        </Select>
  );
};

export default QueryBuilderSelectColumn;