import React from "react";

const TitledForm = props => {
  return (
    <div className="field">
      <label>{props.title}</label>
      <input type="text" {...props} />
    </div>
  );
};

export default TitledForm;