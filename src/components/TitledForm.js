import React from "react";

const TitledForm = props => {
  // TODO: passing props.disabled causes an attribute disabled=""
  // but the correct form when disabled is disabled="disabled" or just disabled
  return (
    <div className={`required ${props.disabled ? "disabled " : ""}field`}>
      {props.guidance !== undefined ? <p>{props.guidance}</p> : ""}
      <label>{props.title}</label>
      {props.description ? <span>{props.description}</span> : null}
      {props.rows ? <textarea {...props} /> : <input type="text" {...props} />}
    </div>
  );
};

export default TitledForm;
