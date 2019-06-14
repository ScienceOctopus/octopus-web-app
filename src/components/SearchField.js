import React from "react";

const SearchField = props => {
  let containerClass = "ui search item ";
  if (props.loading) {
    containerClass += "loading";
  }

  return (
    <div className={containerClass}>
      <form onSubmit={props.onSubmit}>
        <div className="ui icon input">
          <input className="prompt" type="text" {...props} />
          <i className="search icon" />
        </div>
      </form>
      <div className="results" />
    </div>
  );
};

export default SearchField;
