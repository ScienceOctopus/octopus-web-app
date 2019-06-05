import React from "react";

const SearchField = props => {
  return (
    <div className="ui search item">
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
