import { SelectChangeEvent, Select, Box, FormControl, InputLabel, MenuItem } from '@mui/material';
import React from 'react';

const QueryBuilderSelectColumn: React.FC<{
    onSelect: (value: string) => void;
    tableData: { [key: string]: { table_name: string; column_name: string; udt_name: string }[] };
    tableNames: string[] | null;
}> = ({ onSelect, tableData, tableNames }) => {
    const [column, setColumn] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setColumn(event.target.value as string);
        onSelect(event.target.value as string);
    };

    return (
        <Select
            sx={{ minWidth: 120 }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={column}
            onChange={handleChange}
        >
            {tableNames
                ? tableNames.map((tableName) =>
                      tableData[tableName]!.map((column) => (
                          <MenuItem key={column.column_name} value={`${column.table_name}.${column.column_name}`}>
                              {column.table_name}.{column.column_name}
                          </MenuItem>
                      ))
                  )
                : []}
        </Select>
    );
};

export default QueryBuilderSelectColumn;
