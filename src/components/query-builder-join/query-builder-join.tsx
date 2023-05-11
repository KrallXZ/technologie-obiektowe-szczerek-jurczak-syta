import React, { useState } from "react";
import QueryBuilderSelect from "../query-builder-select/query-builder-select";
import QueryBuilderSelectColumn from "../query-builder-select-column/query-builder-select-column";

const QueryBuilderJoin: React.FC<{tableData: {[key: string]: {table_name: string;
    column_name: string;
    udt_name: string}[]}, tableName: string}> = ({tableData,tableName}) => {
        
    const [selectedTable, setSelectedTable] = useState("");

  return (
    <div>
    JOIN <QueryBuilderSelect onSelect={(selectedTable: string) => setSelectedTable(selectedTable)} tableData={Object.keys(tableData)}/> ON     <QueryBuilderSelectColumn tableData={tableData} tableName={selectedTable}/> =     <QueryBuilderSelectColumn tableData={tableData} tableName={tableName}/>
    </div>
  );
};

export default QueryBuilderJoin;