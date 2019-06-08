import React, { Component } from "react";
import Api from "../api";
import { LocalizedLink, path, RouterURI } from "../urls/WebsiteURIs";

const DESC_MAX_LENGTH = 200;

export default class ProblemSearchDescription extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, pubCountLoaded: false };
  }

  componentDidMount() {
    this.fetchProblem();
  }

  fetchProblem() {
    Api()
      .problem(this.props.id)
      .get()
      .then(problem => {
        this.setState({ loaded: true, problem });
      });

    Api()
      .problem(this.props.id)
      .publications()
      .count()
      .then(pubCount => this.setState({ pubCountLoaded: true, pubCount }));
  }

  publicationCountString() {
    return this.state.pubCountLoaded ? this.state.pubCount : "...";
  }

  renderPublicationCount() {
    return (
      <LocalizedLink to={path(RouterURI.Problem, { id: this.props.id })}>
        <div className="ui button icon teal" style={styles.countLabel}>
          <i className="ui icon file alternate outline computer tablet only" />
          {" " + this.publicationCountString()}
        </div>
      </LocalizedLink>
    );
  }

  renderProblem() {
    if (!this.state.problem) {
      throw Error("Trying to render problem which is not in the state");
    }
    const { title, description, updated_at } = this.state.problem;
    const dateString = new Date(updated_at).toLocaleDateString();

    return (
      <div>
        <div className="ui grid" style={styles.container}>
          <div className="fourteen wide column">
            <LocalizedLink
              style={styles.link}
              to={path(RouterURI.Problem, { id: this.props.id })}
            >
              {title}
            </LocalizedLink>
          </div>
          <div className="two wide column">{this.renderPublicationCount()}</div>
        </div>
        <p style={styles.description}>
          {trimmed(description, DESC_MAX_LENGTH)}
        </p>
        <p style={styles.modifiedDate}>Last modified: {dateString}</p>
      </div>
    );
  }

  renderLoading() {
    return "Loading problem description...";
  }

  render() {
    return (
      <div className="ui container" style={styles.container}>
        <hr />
        {this.state.loaded ? this.renderProblem() : this.renderLoading()}
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
  container: {
    paddingTop: "1em",
  },
  link: {
    fontSize: "1.5rem",
  },
  description: {
    marginTop: "0.4rem",
    fontSize: "1rem",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
    // maxHeight: "2.4rem",
  },
  modifiedDate: {
    fontSize: "0.8rem",
    color: "grey",
  },
  countLabel: {
    fontSize: "1rem",
    width: "100%",
    fontWeight: "700",
  },
};
