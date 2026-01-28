import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";
import useStateStore from "../../store.js"
export default function BlockNote() {
  // Create the editor instance
  const editor = useCreateBlockNote();
  const [emailTemplate, setEmailTemplate] = useState("");


  // import global states for email content
  const {emailContent, updateEmailContent} = useStateStore();

  // Function to extract and convert content into a template string
  const detectChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    
    // Convert placeholders {{name}} -> ${name}
    const templateString = html.replace(/\{\{(.*?)\}\}/g, "${$1}");

    setEmailTemplate(templateString);
    updateEmailContent(templateString);
  };

  

  return (
    <div className="flex flex-col gap-4">
      {/* BlockNote Editor */}
      <BlockNoteView editor={editor} onChange={detectChange} theme={"light"} />

      
    </div>
  );
}
