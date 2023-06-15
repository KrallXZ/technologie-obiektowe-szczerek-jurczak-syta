import React, { useEffect, useState } from "react";
import QueryBuilderSelect from "../query-builder-select/query-builder-select";
import QueryBuilderSelectColumn from "../query-builder-select-column/query-builder-select-column";
import { Button } from "@mui/material";

type QueryBuilderJoinProps = {
  onSelect: (joinData: {
    tableName: string;
    columnName: string;
    foreignColumnName: string;
  }) => void;
  tableData: {
    [key: string]: {
      table_name: string;
      column_name: string;
      udt_name: string;
    }[];
  };
  tableNames: string[];
  onDelete: () => void;
};

const QueryBuilderJoin: React.FC<QueryBuilderJoinProps> = ({
  onSelect,
  tableData,
  tableNames,
  onDelete,
}) => {
  const [joinData, setJoinData] = useState<{
    tableName: string;
    columnName: string;
    foreignColumnName: string;
  }>({
    tableName: "",
    columnName: "",
    foreignColumnName: "",
  });

  useEffect(() => {
    if (
      joinData.tableName &&
      joinData.columnName &&
      joinData.foreignColumnName
    ) {
      onSelect(joinData);
    }
  }, [joinData, onSelect]);

  return (
    <div className="flex items-center gap-5">
      JOIN
      <QueryBuilderSelect
        onSelect={(selectedTable: string) => {
          setJoinData((data) => ({ ...data, tableName: selectedTable }));
        }}
        tableData={Object.keys(tableData)}
      />
      ON
      <QueryBuilderSelectColumn
        label="Column"
        disabled={!joinData.tableName}
        onSelect={(selectedColumn: string) =>
          setJoinData((data) => ({ ...data, columnName: selectedColumn }))
        }
        tableData={tableData}
        tableNames={joinData.tableName ? [joinData.tableName] : null}
      />
      =
      <QueryBuilderSelectColumn
        label="Foreign column"
        disabled={!joinData.tableName}
        onSelect={(selectedColumn: string) =>
          setJoinData((data) => ({
            ...data,
            foreignColumnName: selectedColumn,
          }))
        }
        tableData={tableData}
        tableNames={tableNames}
      />
      <Button onClick={onDelete} color="error" variant="outlined">
        Remove
      </Button>
    </div>
  );
};

export default QueryBuilderJoin;
