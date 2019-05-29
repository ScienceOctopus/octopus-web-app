import React from "react";
const FileUploadSelector = props => {
  return <input type="file" name="file" onChange={props.onSelect} />;
};

export default FileUploadSelector;
