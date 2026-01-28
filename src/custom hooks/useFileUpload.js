import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const useFileUpload = (acceptedFileTypes) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Only storing one file at a time
    }
  }, []);

  const removeFile = useCallback(() => {
    setFile(null); // This should trigger a re-render
  }, []);

  const dropzone = useDropzone({
    accept: acceptedFileTypes,
    multiple: false,
    onDrop,
  });

  return { file, dropzone, removeFile };
};

export default useFileUpload;
