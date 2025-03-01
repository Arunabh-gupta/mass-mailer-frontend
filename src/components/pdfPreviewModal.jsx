function PdfPreviewModal({ file, isOpen, onClose }) {
  if (!isOpen || !file) return null;

  const fileURL = URL.createObjectURL(file);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[1200px] h-[700px] flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">PDF Preview</h2>
          <button onClick={onClose} className="text-red-500 text-xl font-bold">✖</button>
        </div>
        <div className="flex-grow overflow-hidden mt-4 border">
          <object
            data={fileURL}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <p className="text-center text-gray-600 mt-4">
              Your browser does not support PDFs. 
              <a href={fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Download it</a> instead.
            </p>
          </object>
        </div>
      </div>
    </div>
  );
}

export default PdfPreviewModal;
