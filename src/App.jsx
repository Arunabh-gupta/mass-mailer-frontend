import { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css";
import BlockNote from "./components/BlockNote/BlockNote";

function App() {
  const [csvFile, setCsvFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  // Dropzone handler
  const onDrop = (acceptedFiles, type) => {
    const file = acceptedFiles[0];
    if (file) {
      if (type === "csv") setCsvFile(file);
      else if (type === "resume") setResume(file);
      else if (type === "coverLetter") setCoverLetter(file);
    }
  };

  const dropzoneOptions = (type) => ({
    onDrop: (files) => onDrop(files, type),
    accept:
      type === "csv"
        ? { "text/csv": [".csv"] }
        : {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
              ".docx",
            ],
          },
    multiple: false,
  });

  const csvDropzone = useDropzone(dropzoneOptions("csv"));
  const resumeDropzone = useDropzone(dropzoneOptions("resume"));
  const coverLetterDropzone = useDropzone(dropzoneOptions("coverLetter"));

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-8 space-y-8">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">📧 Bulk Email Sender</h1>
        <p className="text-gray-600 mt-2">Send personalized emails to multiple recipients with ease.</p>
      </div>

      {/* Dropzone Row */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            dropzone: csvDropzone,
            file: csvFile,
            borderColor: "border-blue-500",
            bgColor: "bg-blue-100 hover:bg-blue-200",
            textColor: "text-blue-800",
            placeholder: "Upload CSV File (Recipients List)",
          },
          {
            dropzone: resumeDropzone,
            file: resume,
            borderColor: "border-green-500",
            bgColor: "bg-green-100 hover:bg-green-200",
            textColor: "text-green-800",
            placeholder: "Upload Resume (PDF/DOCX)",
          },
          {
            dropzone: coverLetterDropzone,
            file: coverLetter,
            borderColor: "border-yellow-500",
            bgColor: "bg-yellow-100 hover:bg-yellow-200",
            textColor: "text-yellow-800",
            placeholder: "Upload Cover Letter (PDF/DOCX)",
          },
        ].map(({ dropzone, file, borderColor, bgColor, textColor, placeholder }, index) => (
          <div
            key={index}
            {...dropzone.getRootProps()}
            className={`border ${borderColor} p-4 rounded-lg ${bgColor} text-center cursor-pointer transition-transform transform hover:scale-105 shadow-md`}
          >
            <input {...dropzone.getInputProps()} />
            <p className={`${textColor} font-medium`}>
              {file ? file.name : placeholder}
            </p>
          </div>
        ))}
      </div>

      {/* Email Subject Input */}
      <input
        type="text"
        placeholder="Subject"
        className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Email Editor */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-lg">
        <BlockNote />
      </div>

      {/* Send Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-600 transition-all transform hover:scale-105">
          Send Email
        </button>
      </div>
    </div>
  );
}

export default App;
