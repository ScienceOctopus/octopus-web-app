import React from "react";

import TagSelector from "./TagSelector";

const TitledTagSelector = props => {
  return (
    <div className={`${props.disabled ? "disabled " : ""}field`}>
      {props.guidance !== undefined ? <p>{props.guidance}</p> : ""}
      <label>{props.title}</label>
      {props.description ? <span>{props.description}</span> : null}
      <TagSelector
        tags={props.tags}
        index={props.index}
        input={true}
        onUpdate={props.onChange}
      />
    </div>
  );
};

export default TitledTagSelector;
