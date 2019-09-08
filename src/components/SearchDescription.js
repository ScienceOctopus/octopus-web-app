import React, { Component } from "react";
import { LocalizedLink, path, RouterURI } from "../urls/WebsiteURIs";

const DESC_MAX_LENGTH = 200;

export default class ProblemSearchDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  ClickableSelect = props => {
    return (
      <div
        onClick={() => this.props.onSelect(this.state.problem)}
        style={props.style}
        className={props.className}
      >
        {props.children}
      </div>
    );
  };

  ClickableLink = props => {
    const { id, type } = this.props.item;
    const uri = type === "problem" ? RouterURI.Problem : RouterURI.Publication;

    return (
      <LocalizedLink
        to={path(uri, { id })}
        style={props.style}
        className={props.className}
      >
        {props.children}
      </LocalizedLink>
    );
  };

  Clickable = props => {
    if (this.props.onSelect === undefined) {
      return (
        <this.ClickableLink
          className={props.className}
          style={props.style}
          children={props.children}
        />
      );
    } else {
      return (
        <this.ClickableSelect
          className={props.className}
          style={props.style}
          children={props.children}
        />
      );
    }
  };

  render() {
    const { stage, item } = this.props;

    if (!item) {
      return null;
    }

    const { title, summary, count, updated_at, description } = item;

    const dateString = new Date(updated_at).toLocaleDateString();

    return (
      <div className="item" style={styles.item}>
        <div className="right floated content">
          <this.Clickable className="ui label" style={styles.countLabel}>
            {(stage && <span>{stage.name}</span>) || (
              <span>
                <i className="file icon"></i>
                {count}
              </span>
            )}
          </this.Clickable>
        </div>
        <div className="content">
          <this.Clickable className="header" style={styles.link}>
            <h3>{title}</h3>
          </this.Clickable>
          <div className="description">
            {trimmed(description || summary || "", DESC_MAX_LENGTH)}
          </div>
        </div>
        <div className="content">
          <p style={styles.modifiedDate}>Last modified: {dateString}</p>
        </div>
      </div>
    );
  }
}

const trimmed = (str, n) => {
  if (str.length <= n) return str;
  str = str.substring(0, n - 4);
  return str.substring(0, Math.min(str.length, str.lastIndexOf(" "))) + " ...";
};

const styles = {
  item: {
    padding: "1rem",
  },
  link: {
    marginBottom: 10,
  },
  modifiedDate: {
    marginTop: 10,
    fontSize: "0.8rem",
    color: "grey",
  },
};
