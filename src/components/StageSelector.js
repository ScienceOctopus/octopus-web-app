import React, { Component } from "react";
import SimpleSelector from "./SimpleSelector";

class StageSelector extends Component {
  render() {
    return (
      <SimpleSelector
        url={`/api/problems/${this.props.problemId}/stages`}
        title="Select a Publication Type"
        {...this.props}
      />
    );
  }
}

export default StageSelector;
