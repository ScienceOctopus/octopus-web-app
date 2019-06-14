import React from "react";
const FileUploadSelector = props => {
  // TODO: passing props.disabled causes an attribute disabled=""
  // but the correct form when disabled is disabled="disabled" or just disabled
  return (
    <div className={`required ${props.disabled ? "disabled " : ""}field`}>
      <label>{props.title}</label>
      <input
        type="file"
        disabled={props.disabled ? "disabled" : ""}
        name="file"
        onChange={props.onSelect}
      />
    </div>
  );
};

export default FileUploadSelector;
