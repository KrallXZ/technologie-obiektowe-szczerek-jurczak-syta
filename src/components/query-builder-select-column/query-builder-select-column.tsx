import {
  type SelectChangeEvent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React from "react";

const QueryBuilderSelectColumn: React.FC<{
  label?: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
  tableData: {
    [key: string]: {
      table_name: string;
      column_name: string;
      udt_name: string;
    }[];
  };
  tableNames: string[] | null;
}> = ({ onSelect, tableData, tableNames, label = "Column", disabled }) => {
  const [column, setColumn] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setColumn(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        sx={{ minWidth: 120 }}
        label={label}
        value={column}
        disabled={disabled}
        onChange={handleChange}
      >
        {tableNames
          ? tableNames.map((tableName) =>
              tableData[tableName]?.map((column) => (
                <MenuItem
                  key={column.column_name}
                  value={`${column.table_name}.${column.column_name}`}
                >
                  {column.table_name}.{column.column_name}
                </MenuItem>
              ))
            )
          : []}
      </Select>
    </FormControl>
  );
};

export default QueryBuilderSelectColumn;
