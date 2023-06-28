import { type NextPage } from 'next';
import Layout from '~/components/layout/layout';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { api } from '~/utils/api';
import { Button, MenuItem, Select, type SelectChangeEvent, TextField } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';

type Filter = {
    id: string; // uuidv4
    columnName: string;
    value: string;
};

const MongodbQueryDetails: NextPage = () => {
    const router = useRouter();
    const [filters, setFilters] = React.useState<Filter[]>([]);
    const [tableHeader, setTableHeader] = React.useState('');
    const [columns, setColumns] = React.useState<Map<string, string>>(new Map());
    const [filteredColumnNames, setFilteredColumnNames] = React.useState<Set<string>>(new Set());

    const { connectionString, databaseName, collectionName, isEnabledQueryResults } = router.query;

    const queryResults = api.mongodb.getDatabaseResults.useQuery(
        { connectionString, databaseName, collectionName },
        { enabled: Boolean(isEnabledQueryResults) }
    );
    const querySpecificResults = api.mongodb.getSpecificDatabaseResults.useMutation();

    const selectSpecificResults = () => {
        const _filters = filters.map((filter) => {
            const filterType = columns.get(filter.columnName);
            const _filterValue =
                filterType === 'number'
                    ? Number(filter.value)
                    : filterType === 'null'
                    ? null
                    : filterType === 'undefined'
                    ? undefined
                    : filter.value;
            return { filterName: filter.columnName, filterValue: _filterValue };
        });
        querySpecificResults.mutate({
            connectionString,
            databaseName,
            collectionName,
            filters: _filters,
        });

        setFilteredColumnNames(new Set());
    };

    useEffect(() => {
        if (queryResults?.data) {
            const columns = new Map<string, string>();

            queryResults.data.forEach((item) => {
                Object.entries(item).forEach(([key, value]) => {
                    if (!columns.has(key)) {
                        columns.set(key, typeof value);
                    }
                });
            });

            setColumns(columns);
        }
    }, [queryResults.data]);

    useEffect(() => {
        if (querySpecificResults?.data) {
            querySpecificResults.data.forEach((item) => {
                setFilteredColumnNames((prevValues) => new Set([...prevValues, ...Object.keys(item)]));
            });
        }
    }, [querySpecificResults.data]);

    const resultColumns: GridColDef[] = useMemo(() => {
        if (filteredColumnNames.size > 0) {
            return Array.from(filteredColumnNames).map((column) => {
                return {
                    field: column,
                    headerName: column,
                    width: 150,
                };
            });
        } else {
            return Array.from(columns.keys()).map((column) => {
                return {
                    field: column,
                    headerName: column,
                    width: 150,
                };
            });
        }
    }, [columns, filteredColumnNames]);

    const resultRows: GridRowsProp = useMemo(() => {
        if (querySpecificResults.data?.length > 0 && filters.length > 0) {
            setTableHeader('Filtered values');
            return (
                querySpecificResults.data?.map((row, index) => ({
                    ...row,
                    id: index,
                })) || []
            );
        } else {
            setTableHeader('All values');
            return queryResults.data?.map((row, index) => ({ ...row, id: index })) || [];
        }
    }, [queryResults.data, querySpecificResults.data]);

    return (
        <>
            <Layout>
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        MongoDB Query Builder
                    </h1>

                    <div>
                        {queryResults.isLoading ? (
                            ''
                        ) : (
                            <div className="mb-2 flex flex-col items-center text-2xl text-white">{tableHeader}: </div>
                        )}
                        {queryResults.isLoading ? (
                            <div>Loading...</div>
                        ) : queryResults.data ? (
                            <DataGrid columns={resultColumns} rows={resultRows} />
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-3">
                        {filters.map(({ id, columnName, value }) => (
                            <div className="flex justify-center gap-2" key={id}>
                                <Select
                                    key={id}
                                    value={columnName}
                                    placeholder={'Select filter name'}
                                    onChange={(event) =>
                                        setFilters((filters) =>
                                            filters.map((filter) =>
                                                filter.id === id
                                                    ? { ...filter, columnName: event?.target.value }
                                                    : filter
                                            )
                                        )
                                    }
                                    sx={{ minWidth: 120 }}
                                >
                                    {Array.from(columns.keys()).map((columnName) => (
                                        <MenuItem key={columnName} value={columnName}>
                                            {columnName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    key={id}
                                    variant="outlined"
                                    label="Filter value"
                                    value={value}
                                    onChange={(event) =>
                                        setFilters((filters) =>
                                            filters.map((filter) =>
                                                filter.id === id ? { ...filter, value: event?.target.value } : filter
                                            )
                                        )
                                    }
                                ></TextField>
                                <Button
                                    onClick={() =>
                                        setFilters((filters) => filters.filter((filter) => filter.id !== id))
                                    }
                                    color="error"
                                    variant="outlined"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    setFilters((filters) => [
                                        ...filters,
                                        {
                                            id: uuidv4(),
                                            columnName: '',
                                            value: '',
                                        },
                                    ]);
                                }}
                                variant="outlined"
                            >
                                Add new Filter
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setFilters([]);
                                }}
                            >
                                Clear Filters
                            </Button>
                            <Button
                                onClick={() => {
                                    selectSpecificResults();
                                }}
                                variant="outlined"
                            >
                                Select specific results
                                <KeyboardArrowRightIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default MongodbQueryDetails;
