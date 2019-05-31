import React, { Component } from "react";
import SimpleSelector from "./SimpleSelector";

class ProblemSelector extends Component {
  render() {
    return (
      <SimpleSelector
        url="/api/problems"
        title="Select a Problem"
        onSelect={this.props.onSelect}
      />
    );
  }
}

export default ProblemSelector;
