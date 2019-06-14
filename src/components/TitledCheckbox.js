import React from "react";

const TitledCheckbox = props => {
  // TODO: passing props.disabled causes an attribute disabled=""
  // but the correct form when disabled is disabled="disabled" or just disabled
  return (
    <div className={`${props.disabled ? "disabled " : ""}field`}>
      <label>{props.title}</label>
      <div className="ui checkbox">
        <input type="checkbox" {...props} />
        <label htmlFor={props.id}>{props.description || " "}</label>
      </div>
    </div>
  );
};

export default TitledCheckbox;
