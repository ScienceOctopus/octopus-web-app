import React from "react";

const sortCategories = ["Alphabetically", "Rating", "Date"];

const renderSortButton = (active, onClick, style, iconClassName) => {
  return (
    <button
      className={active ? "mini ui button" : "mini basic ui button"}
      style={style}
      onClick={onClick}
    >
      <i className={iconClassName} style={{ margin: 0 }} />
    </button>
  );
};

const SortField = props => {
  return (
    <div className="ui compact menu" style={{ borderRadius: "50px" }}>
      <div
        className="ui simple dropdown item"
        style={{ borderRadius: "15px 0 0 0" }}
      >
        {props.sortCategory}
        <div className="menu">
          {sortCategories.map((category, index) => (
            <div
              key={index}
              className="item"
              onClick={() => props.handleSortCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {renderSortButton(
        props.sortAscendent,
        props.handleAscendent,
        styles.sortAscendentButton,
        "angle up icon",
      )}

      {renderSortButton(
        props.sortDescendent,
        props.handleDescendent,
        styles.sortDescendentButton,
        "angle down icon",
      )}
    </div>
  );
};

const styles = {
  sortAscendentButton: {
    borderRight: "0.5px solid grey",
    textAlign: "center",
    marginRight: 0,
    borderRadius: 0,
  },
  sortDescendentButton: {
    borderLeft: "0.5px solid grey",
    textAlign: "center",
    marginRight: 0,
    borderRadius: "0 50px 50px 0",
  },
};

export default SortField;
