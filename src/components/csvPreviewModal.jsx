import { useState, useEffect } from "react";

function CsvPreviewModal({ file, isOpen, onClose }) {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split("\n").map((row) => row.split(","));
        setCsvData(rows);
      };
      reader.readAsText(file);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[80vw] h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-bold">CSV Preview</h2>
          <button onClick={onClose} className="text-red-500 text-2xl font-bold">✖</button>
        </div>

        {/* CSV Table Viewer */}
        <div className="flex-grow overflow-auto mt-4 border">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              {csvData.length > 0 && (
                <tr>
                  {csvData[0].map((col, index) => (
                    <th key={index} className="border px-4 py-2">{col}</th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {csvData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="border">
                  {row.map((col, colIndex) => (
                    <td key={colIndex} className="border px-4 py-2">{col}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CsvPreviewModal;
