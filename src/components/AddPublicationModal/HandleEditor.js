import React from "react";
import Latex from "react-latex";
import CKEditor from "ckeditor4-react";

const HandleEditor = props => {
  if (props.selectedFile) {
    switch (props.selectedFile.type) {
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <CKEditor data={props.editorData} />;
      case "application/pdf":
        return <CKEditor data={props.editorData} />;
      case "application/msword":
        return null;
      case "text/x-tex":
        return <Latex>$$(3\times 4) \div (5-3)$$</Latex>;
      default:
        return null;
    }
  }
  return <CKEditor data={props.editorData} />;
};
export default HandleEditor;
