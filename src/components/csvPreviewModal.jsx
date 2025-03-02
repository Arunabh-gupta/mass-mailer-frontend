import React from "react";
import {DataGrid} from "react-data-grid";
import "react-data-grid/lib/styles.css";
import useCsvParser from "../custom hooks/useCsvParser";

const CsvPreviewModal = ({ file, isOpen, onClose }) => {
  const { columns, rows, setRows, setColumns } = useCsvParser(file);

  if (!isOpen) return null;

  const editableColumns = columns.map((col) => ({
    ...col,
    renderHeaderCell: () => (
      <input
        type="text"
        defaultValue={col.name}
        className="w-full bg-transparent text-black font-semibold border-none focus:ring-2 focus:ring-blue-400"
        onBlur={(e) => handleColumnNameChange(col.key, e.target.value)}
      />
    ),
  }));
  function onCellClick(args, event) {
    if (args.column.key === "id") {
      // event.preventGridDefault();
      // args.selectCell(true);
    }

    console.log(args)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-4/5 h-3/5 rounded-lg shadow-lg flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">CSV Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* CSV Data Grid */}
        <div className="flex-grow overflow-auto p-4">
          <DataGrid
            columns={columns}
            rows={rows}
            className="rdg-light"
          />

        </div>
      </div>
    </div>
  );
};

export default CsvPreviewModal;
