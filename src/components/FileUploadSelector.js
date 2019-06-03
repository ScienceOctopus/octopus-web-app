import React from "react";
const FileUploadSelector = props => {
  return (
	<div className="field">
    <input type="file" name="file" onChange={props.onSelect} />
	</div>
  );
};

export default FileUploadSelector;