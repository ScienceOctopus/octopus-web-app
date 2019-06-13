import React, { Component } from "react";
import ProblemSearchDescription from "../components/ProblemSearchDescription";

import Api from "../api";
import { loginRequired } from "./LogInRequiredPage";

const SEARCH_KEY = "search";

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  fetchAllProblems() {
    Api()
      .subscribe(SEARCH_KEY)
      .problems()
      .get()
      .then(problems =>
        this.setState({
          problems: problems
            .filter(x => x.creator === global.session.user)
            .map(x => x.id),
        }),
      );
  }

  renderProblems() {
    return this.state.problems.map(id => (
      <ProblemSearchDescription id={id} key={id} />
    ));
  }

  render() {
    if (!this.state.problems) return null;
    return this.renderProblems();
  }
}

export default loginRequired(UserPage);
