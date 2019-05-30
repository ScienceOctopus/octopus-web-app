import React from "react";
const FileUploadSelector = props => {
  return (
    <input type="file" name="file" onChange={props.onSelect} style={style} />
  );
};

const style = {
  margin: "0.5em",
  width: "15rem",
};

export default FileUploadSelector;
