import { Box, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent, tableSortLabelClasses } from '@mui/material';
import { on } from 'events';
import React, { useEffect } from 'react';
import { api } from '~/utils/api';

const QueryBuilderMultiSelect: React.FC<{
    onSelect: (value: string[]) => void;
    tableData: { [key: string]: { table_name: string; column_name: string; udt_name: string }[] };
    tableNames: string[];
}> = ({ onSelect, tableData, tableNames }) => {
    const [selectedColumn, setSelectedColumn] = React.useState<string[]>([]);
    const handleChange = (event: SelectChangeEvent<typeof selectedColumn>) => {
        const {
            target: { value },
        } = event;
        setSelectedColumn(typeof value === 'string' ? value.split(',') : value);
        onSelect(value as string[]);
    };

    useEffect(() => {
        if (tableNames && selectedColumn.length > 0) {
            setSelectedColumn(selectedColumn.filter((column) => tableNames.includes(column.split('.')[0])));
        }
    }, [tableNames]);

    return (
        <Select
            sx={{ minWidth: 120 }}
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={selectedColumn}
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
            {tableNames
                ? tableNames.map((tableName: string) =>
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

export default QueryBuilderMultiSelect;
