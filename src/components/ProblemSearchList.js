import React, { Component } from "react";
import Api from "../api";
import ProblemSearchDescription from "./ProblemSearchDescription";

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

export default ProblemSearchList;
