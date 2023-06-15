import React, { useEffect, useState } from "react";
import QueryBuilderSelectColumn from "../query-builder-select-column/query-builder-select-column";
import { Button, TextField } from "@mui/material";

type WhereData = {
  columnName: string;
  value: string;
};

type QueryBuilderWhereProps = {
  onSelect: (whereData: WhereData) => void;
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

const QueryBuilderJoin: React.FC<QueryBuilderWhereProps> = ({
  onSelect,
  tableData,
  tableNames,
  onDelete,
}) => {
  const [whereData, setWhereData] = useState<WhereData>({
    columnName: "",
    value: "",
  });

  useEffect(() => {
    if (whereData.columnName && whereData.value) {
      onSelect(whereData);
    }
  }, [whereData, onSelect]);

  return (
    <div className="flex items-center gap-5">
      WHERE
      <QueryBuilderSelectColumn
        disabled={!tableNames.length}
        label="Column"
        onSelect={(selectedColumn: string) =>
          setWhereData((data) => ({ ...data, columnName: selectedColumn }))
        }
        tableData={tableData}
        tableNames={tableNames}
      />
      =
      <TextField
        variant="outlined"
        label="Value"
        value={whereData.value}
        onChange={(event) => {
          setWhereData((data) => ({ ...data, value: event.target.value }));
        }}
      ></TextField>
      <Button onClick={onDelete} color="error" variant="outlined">
        Remove
      </Button>
    </div>
  );
};

export default QueryBuilderJoin;
