import React, { useEffect, useState } from 'react';
import QueryBuilderSelect from '../query-builder-select/query-builder-select';
import QueryBuilderSelectColumn from '../query-builder-select-column/query-builder-select-column';
import { join } from 'path';

const QueryBuilderJoin: React.FC<{
    onSelect: (joinData: { tableName: string; columnName: string; foreignColumnName: string }) => void;
    tableData: { [key: string]: { table_name: string; column_name: string; udt_name: string }[] };
    tableNames: string[];
}> = ({ onSelect, tableData, tableNames }) => {
    const [joinData, setJoinData] = useState<{ tableName: string; columnName: string; foreignColumnName: string }>({
        tableName: '',
        columnName: '',
        foreignColumnName: '',
    });

    useEffect(() => {
        if (joinData.tableName && joinData.columnName && joinData.foreignColumnName) {
            onSelect(joinData);
        }
    }, [joinData]);

    return (
        <div>
            JOIN{' '}
            <QueryBuilderSelect
                onSelect={(selectedTable: string) => {
                    setJoinData((data) => ({ ...data, tableName: selectedTable }));
                }}
                tableData={Object.keys(tableData)}
            />{' '}
            ON
            <QueryBuilderSelectColumn
                onSelect={(selectedColumn: string) =>
                    // setJoinData({ ...joinData, column: [...joinData.column, selectedColumn] })
                    setJoinData((data) => ({ ...data, columnName: selectedColumn }))
                }
                tableData={tableData}
                tableNames={joinData.tableName ? [joinData.tableName] : null}
            />{' '}
            =
            <QueryBuilderSelectColumn
                onSelect={(selectedColumn: string) =>
                    // setJoinData({ ...joinData, column: [...joinData.column, selectedColumn] })
                    setJoinData((data) => ({ ...data, foreignColumnName: selectedColumn }))
                }
                tableData={tableData}
                tableNames={tableNames}
            />
        </div>
    );
};

export default QueryBuilderJoin;
