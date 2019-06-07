import React, { Component } from "react";
import ProblemSearchList from "../components/ProblemSearchList";

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ProblemSearchList allProblems />
      </div>
    );
  }
}

export default SearchPage;
