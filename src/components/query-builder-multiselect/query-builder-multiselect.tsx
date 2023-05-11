import { Box, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent, tableSortLabelClasses } from "@mui/material";
import React from "react";
import { api } from "~/utils/api";

const QueryBuilderMultiSelect: React.FC<{tableData: {[key: string]: {table_name: string;
    column_name: string;
    udt_name: string}[]}, tableName: string}> = ({tableData, tableName}) => {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  return (
        <Select
          sx={{ minWidth: 120 }}
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value: any) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
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

export default QueryBuilderMultiSelect;