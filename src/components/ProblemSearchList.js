import React, { Component } from "react";
import Api from "../api";
import { LocalizedLink } from "../urls/WebsiteURIs";

class ProblemSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, problems: [] };
  }

  componentDidMount() {
    if (this.props.allProblems) {
      this.fetchAllProblems();
    } else {
      this.props.problemIDs.forEach(id => this.fetchProblem(id));
    }
  }

  fetchAllProblems() {
    Api()
      .problems()
      .get()
      .then(problems => {
        this.setState({
          loaded: true,
          problems: problems.map(x => x.id),
        });
      });
  }

  renderProblems() {
    return this.state.problems.map((x, i) => (
      <ProblemSearchDescription id={x} key={i} />
    ));
  }

  render() {
    return (
      <div>
        {this.state.loaded
          ? this.renderProblems()
          : "Searching for problems..."}
      </div>
    );
  }
}

class ProblemSearchDescription extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
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
  }

  renderProblem() {
    if (!this.state.problem) {
      throw Error("Trying to render problem which is not in the state");
    }
    const { title, description, updated_at } = this.state.problem;
    const dateString = new Date(updated_at).toLocaleDateString();
    const numProblems = 10000;

    return (
      <div className="ui container" style={styles.container}>
        <div className="ui grid " style={styles.container}>
          <div className="fourteen wide column">
            <LocalizedLink style={styles.link} to="/">
              {title}
            </LocalizedLink>
          </div>
          <div className="two wide column">{numProblems}</div>
        </div>
        <p style={styles.description}>{description}</p>
        <p style={styles.modifiedDate}>Last modified: {dateString}</p>
      </div>
    );
  }

  renderLoading() {
    return "Loading problem description...";
  }

  render() {
    return (
      <div>
        {this.state.loaded ? this.renderProblem() : this.renderLoading()}
      </div>
    );
  }
}

const styles = {
  container: {
    paddingTop: "1em",
  },
  link: {
    fontSize: "1.5rem",
  },
  description: {
    marginTop: "0.4rem",
    fontsize: "1rem",
  },
  modifiedDate: {
    fontSize: "0.8rem",
    color: "grey",
  },
};

export default ProblemSearchList;
