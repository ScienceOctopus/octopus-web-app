import React from "react";

const TitledForm = props => {
  return (
    <div className="field">
      <label>{props.title}</label>
      {props.description ? <span>{props.description}</span> : null}
      <input type="text" {...props} />
    </div>
  );
};

export default TitledForm;
