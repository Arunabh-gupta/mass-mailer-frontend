import { useState, useEffect } from "react";

const useCsvParser = (file) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      console.log("This is csv file: ", text)
      const lines = text.split("\n").map((line) => line.split(","));

      if (lines.length > 0) {
        const headers = lines[0];
        setColumns(
          headers.map((header, index) => ({
            key: String(index),
            name: header,
            editable: true, // Allow column header editing
          }))
        );

        setRows(
          lines.slice(1).map((row, rowIndex) =>
            headers.reduce((obj, _, colIndex) => {
              obj[colIndex] = row[colIndex] || "";
              return obj;
            }, { id: rowIndex })
          )
        );
      }
    };

    reader.readAsText(file);
  }, [file]);

  const handleRowUpdate = (updatedRow, columnId) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedRow.id ? { ...row, [columnId]: updatedRow[columnId] } : row
      )
    );
  };

  const handleColumnNameChange = (columnId, newName) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.key === columnId ? { ...col, name: newName } : col
      )
    );
  };

  return { columns, rows, setRows, setColumns };
};

export default useCsvParser;
