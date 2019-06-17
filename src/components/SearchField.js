import React from "react";

const SearchField = props => {
  let containerClass = "ui search item";
  if (props.loading) {
    containerClass += " loading";
  }
  if (props.className) {
    containerClass += ` ${props.className}`;
  }

  return (
    <div className={containerClass}>
      <form onSubmit={props.onSubmit}>
        <div className="ui icon input">
          <input
            className="prompt"
            type="text"
            onChange={props.onChange}
            value={props.value}
            placeholder={props.placeholder}
          />
          <i className="search icon" />
        </div>
      </form>
      <div className="results" />
    </div>
  );
};

export default SearchField;
