import { NextPage } from 'next';
import Layout from '~/components/layout/layout';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { api } from '~/utils/api';
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

const MongodbQueryDetails: NextPage = () => {
    const router = useRouter();

    const [filterName, setFilterName] = React.useState('');
    const [filterValue, setFilterValue] = React.useState('');
    const [columnNames, setColumnNames] = React.useState<Set<string>>(new Set());
    const [filteredColumnNames, setFilteredColumnNames] = React.useState<Set<string>>(new Set());

    const { connectionString, databaseName, collectionName, isEnabledQueryResults } = router.query;

    const queryResults = api.mongodb.getDatabaseResults.useQuery(
        { connectionString, databaseName, collectionName },
        { enabled: Boolean(isEnabledQueryResults) }
    );
    const querySpecificResults = api.mongodb.getSpecificDatabaseResults.useMutation();

    const onFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    const onFilterNameChange = (event: SelectChangeEvent<typeof filterName>) => {
        setFilterName(event.target.value);
    };

    const selectSpecificResults = () => {
        querySpecificResults.mutate({
            connectionString,
            databaseName,
            collectionName,
            filterName,
            filterValue,
        });

        setFilteredColumnNames(new Set());
    };

    useEffect(() => {
        if (queryResults?.data) {
            queryResults.data.forEach((item) => {
                setColumnNames((prevValues) => new Set([...prevValues, ...Object.keys(item)]));
            });
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
            return Array.from(columnNames).map((column) => {
                return {
                    field: column,
                    headerName: column,
                    width: 150,
                };
            });
        }
    }, [columnNames, filteredColumnNames]);
    const resultRows: GridRowsProp = useMemo(() => {
        if (querySpecificResults.data?.length > 0) {
            return querySpecificResults.data?.map((row, index) => ({ ...row, id: index })) || [];
        } else {
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
                            <div>Loading...</div>
                        ) : queryResults.data ? (
                            <DataGrid columns={resultColumns} rows={resultRows} />
                        ) : null}
                    </div>

                    <div>
                        <Select
                            value={filterName}
                            placeholder={'Select filter name'}
                            onChange={onFilterNameChange}
                            sx={{ minWidth: 120 }}
                        >
                            {Array.from(columnNames).map((columnName) => (
                                <MenuItem key={columnName} value={columnName}>
                                    {columnName}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            variant="outlined"
                            label="Filter value"
                            value={filterValue}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                onFilterValueChange(event);
                            }}
                        ></TextField>

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
            </Layout>
        </>
    );
};

export default MongodbQueryDetails;
