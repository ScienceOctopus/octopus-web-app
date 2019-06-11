import React from "react";

const TitledCheckbox = props => {
  return (
    <div className="field">
      <label>{props.title}</label>
      <div className="ui checkbox">
        <input type="checkbox" {...props} />
        <label htmlFor={props.id}>{props.description || " "}</label>
      </div>
    </div>
  );
};

export default TitledCheckbox;
