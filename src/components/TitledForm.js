import React from "react";

const TitledForm = props => {
  return (
    <div class="field">
      <label>{props.title}</label>
      <input name="Title" type="text" />
    </div>
  );
};

export default TitledForm;
