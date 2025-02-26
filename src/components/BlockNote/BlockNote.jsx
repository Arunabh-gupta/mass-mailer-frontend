import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

export default function BlockNote() {
  // Create the editor instance
  const editor = useCreateBlockNote();
  const [emailTemplate, setEmailTemplate] = useState("");

  // Function to extract and convert content into a template string
  const detectChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    
    // Convert placeholders {{name}} -> ${name}
    const templateString = html.replace(/\{\{(.*?)\}\}/g, "${$1}");

    setEmailTemplate(templateString);
    console.log("Updated Template String:\n", templateString);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* BlockNote Editor */}
      <BlockNoteView editor={editor} onChange={detectChange} theme={"light"} />

      
    </div>
  );
}
