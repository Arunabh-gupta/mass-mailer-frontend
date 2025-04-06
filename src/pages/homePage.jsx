import { useState, useEffect } from "react";
import BlockNote from "../components/BlockNote/BlockNote";
import useFileUpload from "../custom hooks/useFileUpload";
import PdfPreviewModal from "../components/pdfPreviewModal";
import CsvPreviewModal from "../components/csvPreviewModal";
import useStateStore from "../store.js"
function HomePage() {
	  const csvUpload = useFileUpload({ "text/csv": [".csv"] });
	  const resumeUpload = useFileUpload({ "application/pdf": [".pdf"] });
	  const coverLetterUpload = useFileUpload({ "application/pdf": [".pdf"] });

	  const [previewFile, setPreviewFile] = useState(null);
	  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	  const {passKey, updatePassKey, 
					 subject, updateSubject, 
					 hostEmail, updateHostEmail,
					 emailContent
					} = useStateStore();
	  

		useEffect(()=>{
			console.log("this is email content: ", emailContent)
		}, [emailContent])
		useEffect(()=>{
			console.log("This is the subject of the mail: ",subject)
		}, [subject])
	  return (
		      <div className="flex flex-col h-screen bg-gray-50 p-8 space-y-8">
		        {/* Heading */}
		        <div className="text-center">
		          <h1 className="text-3xl font-extrabold text-gray-900">📧 Bulk Email Sender</h1>
		          <p className="text-gray-600 mt-2">Send personalized emails to multiple recipients with ease.</p>
		        </div>

		        {/* Pass Key Input */}
		        <div className="flex flex-col space-y-2">
		          <label className="text-gray-700 font-medium" htmlFor="passKey">
		            Nodemailer Pass Key:
		          </label>
		          <input
		            type="password"
		            id="passKey"
		            value={passKey}
		            onChange={(e) => setPassKey(e.target.value)}
		            placeholder="Enter your Nodemailer pass key"
		            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
		          />

		          {/* YouTube Tutorial Link */}
		          <a
		            href="https://www.youtube.com/shorts/etJJ5_vvFgQ"
		            target="_blank"
		            rel="noopener noreferrer"
		            className="text-blue-500 hover:underline text-sm"
		          >
		            📺 Watch a YouTube tutorial on getting a passkey from your google account
		          </a>
		        </div>

		        {/* Dropzone Row */}
		        <div className="grid grid-cols-3 gap-6">
		          {[
				            { upload: csvUpload, borderColor: "border-blue-500", bgColor: "bg-blue-100 hover:bg-blue-200", textColor: "text-blue-800", placeholder: "Upload CSV File (Recipients List)" },
				            { upload: resumeUpload, borderColor: "border-green-500", bgColor: "bg-green-100 hover:bg-green-200", textColor: "text-green-800", placeholder: "Upload Resume (PDF)" },
				            { upload: coverLetterUpload, borderColor: "border-yellow-500", bgColor: "bg-yellow-100 hover:bg-yellow-200", textColor: "text-yellow-800", placeholder: "Upload Cover Letter (PDF)" },
				          ].map(({ upload, borderColor, bgColor, textColor, placeholder }, index) => (
						            <div key={index} className="space-y-2">
						              {/* Dropzone */}
						              <div
						                {...upload.dropzone.getRootProps()}
						                className={`border ${borderColor} w-full h-28 flex items-center justify-center p-4 rounded-lg ${bgColor} text-center cursor-pointer transition-transform transform hover:scale-105 shadow-md`}
						              >
						                <input {...upload.dropzone.getInputProps()} />
						                <p className={`${textColor} font-medium text-sm text-center`}>
						                  {upload.file ? upload.file.name : placeholder}
						                </p>
						              </div>

						              {/* Uploaded File Preview */}
						              {upload.file && (
								                    <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-md border border-gray-300 w-full">
								                      {upload.file.type === "application/pdf" ? (
											                        <button
											                          className="text-blue-500 text-sm font-medium underline truncate w-3/4 text-left"
											                          onClick={() => {
															                        setPreviewFile(upload.file);
															                        setIsPreviewOpen(true);
															                      }}
											                        >
											                          {upload.file.name}
											                        </button>
											                      ) : (
														                        <p className="text-gray-700 text-sm truncate w-3/4">{upload.file.name}</p>
														                      )}
								                      <button className="text-red-500 text-sm font-bold px-2" onClick={upload.removeFile}>
								                        ❌
								                      </button>
								                    </div>
								                  )}
						            </div>
						          ))}
		        </div>

						{/* hostEmail input */}
						<input
		          type="text"
		          placeholder="Enter your email..."
		          className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							onChange={(e)=>updateHostEmail(e.target.value)}
		        />

		        {/* Email Subject Input */}
		        <input
		          type="text"
		          placeholder="Subject"
		          className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							onChange={(e)=>updateSubject(e.target.value)}
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

		        {/* PDF Preview Modal */}
		        <PdfPreviewModal
		          file={previewFile}
		          isOpen={isPreviewOpen}
		          onClose={() => setIsPreviewOpen(false)}
		        />

		        {/* CSV Preview Modal */}
		        <CsvPreviewModal
		          file={previewFile}
		          isOpen={isPreviewOpen}
		          onClose={() => setIsPreviewOpen(false)}
		        />
		      </div>
		    );
}

export default HomePage;

