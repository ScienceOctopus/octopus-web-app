import React from "react";

const TitledForm = props => {
  return (
    <div style={style.container}>
      <label style={style.label}>{props.title}</label>
      <input type="text" style={style.input} {...props} />
    </div>
  );
};

const style = {
  container: {
    width: "15rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    margin: "0.5em",
  },
  label: {
    display: "block",
    fontSize: "0.9em",
    fontWeight: 700,
  },
  input: {
    lineHeight: "1.2em",
    padding: "0.66em 1em",
    fontSize: "1em",
    border: "1px solid lightgrey",
    borderRadius: "0.3rem",
    boxShadow: "0 0 0 0 transparent inset",
    transition: "color .1s ease,border-color .1s ease",
  },
};

export default TitledForm;
