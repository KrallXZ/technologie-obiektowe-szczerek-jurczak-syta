import { useEffect, useState } from "react";

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

const QueryBuilderMultiSelect: React.FC<{
  onSelect: (value: string[]) => void;
  tableData: {
    [key: string]: {
      table_name: string;
      column_name: string;
      udt_name: string;
    }[];
  };
  tableNames: string[];
}> = ({ onSelect, tableData, tableNames }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof selectedColumns>) => {
    const {
      target: { value },
    } = event;
    setSelectedColumns(typeof value === "string" ? value.split(",") : value);
    onSelect(value as string[]);
  };

  useEffect(() => {
    setSelectedColumns((selectedColumns) =>
      selectedColumns.filter((column) =>
        tableNames.includes(column.split(".")[0] || "")
      )
    );
  }, [tableNames]);

  return (
    <FormControl>
      <InputLabel>Columns</InputLabel>
      <Select
        sx={{ minWidth: 120 }}
        multiple
        disabled={!tableNames.length}
        value={selectedColumns}
        onChange={handleChange}
        input={<OutlinedInput label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value: string) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {tableNames
          ? tableNames.map((tableName: string) =>
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

export default QueryBuilderMultiSelect;
