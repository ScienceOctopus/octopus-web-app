import React, { Component } from "react";
import Api from "../api";
import ProblemSearchDescription from "./ProblemSearchDescription";

const SEARCH_KEY = "search";

class ProblemSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, problems: [] };

    // Always start a new cache when the search page is loaded
    Api().subscribeClass(SEARCH_KEY, Math.random());
  }

  componentDidMount() {
    this.fetchQuery();
  }

  componentWillUnmount() {
    Api().unsubscribeClass(SEARCH_KEY);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.query !== this.props.query) {
      this.fetchQuery();
    }
  }

  fetchQuery() {
    if (!this.props.query) {
      this.fetchAllProblems();
    } else {
      this.fetchQueryProblems();
    }
  }

  fetchQueryProblems() {
    Api()
      .problems()
      .getQuery(this.props.query)
      .then(problems => {
        this.setState(
          {
            loaded: true,
            problems: problems.map(x => x.id),
          },
          this.loadingComplete,
        );
      });
  }

  fetchAllProblems() {
    Api()
      .problems()
      .get()
      .then(problems => {
        this.setState(
          {
            loaded: true,
            problems: problems.map(x => x.id),
          },
          this.loadingComplete,
        );
      });
  }

  loadingComplete() {
    if (this.props.onLoaded) this.props.onLoaded();
  }

  renderNothingFound() {
    return <h1>Nothing found for query "{this.props.query}"!</h1>;
  }

  renderProblems() {
    if (!this.state.problems.length) {
      return this.renderNothingFound();
    }
    return this.state.problems.map(x => (
      <ProblemSearchDescription id={x} key={x} onSelect={this.props.onSelect} />
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
