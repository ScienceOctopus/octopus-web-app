import React, { useState, useEffect } from "react";
import CKEditor from "ckeditor4-react";

const HandleEditor = props => {
  const { selectedFile, editorData, handleEditorData } = props;
  const [editor, setEditor] = useState(
    <CKEditor
      onChange={event =>
        props.handleEditorData(event.editor.document.$.body.innerHTML)
      }
    />,
  );

  useEffect(() => {
    if (selectedFile) {
      switch (selectedFile.type) {
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          setEditor(
            <CKEditor
              data={editorData}
              onChange={event =>
                handleEditorData(event.editor.document.$.body.innerHTML)
              }
            />,
          );
          break;
        case "application/pdf":
          setEditor(
            <CKEditor
              data={editorData}
              onChange={event =>
                handleEditorData(event.editor.document.$.body.innerHTML)
              }
            />,
          );
          break;
        case "application/msword":
          setEditor(null);
          break;
        case "text/x-tex":
          setEditor(null);
          break;
        default:
          setEditor(null);
      }
    }
  }, [selectedFile]);

  return editor;
};
export default HandleEditor;
