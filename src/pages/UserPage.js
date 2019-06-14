import React, { Component } from "react";
import ProblemSearchDescription from "../components/ProblemSearchDescription";

import Api from "../api";
import { loginRequired } from "./LogInRequiredPage";
import withState from "../withState";

const USER_KEY = "user";

class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = { problems: undefined };

    this.fetchAllProblems();
  }

  componentWillUnmount() {
    Api().unsubscribeClass(USER_KEY);
  }

  fetchAllProblems() {
    Api()
      .subscribeClass(USER_KEY, global.session.user.id)
      .problems()
      .get()
      .then(problems =>
        this.setState({
          problems: problems
            .filter(x => x.creator === global.session.user.id)
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
    let problems = null;

    if (this.state.problems !== undefined) {
      problems = this.renderProblems();
    }

    return (
      <>
        <h2 style={{ textAlign: "center" }}>
          User page of <strong>{global.session.user.display_name}</strong>
          {" ("}
          {
            <a href={`https://orcid.org/${global.session.user.orcid}`}>
              {global.session.user.orcid}
            </a>
          }
          {")"}
        </h2>

        {problems}
      </>
    );
  }
}

export default loginRequired(withState(UserPage));
