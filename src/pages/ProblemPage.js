import React from "react";
import StageGraph from "../components/StageGraph";

export default class ProblemPage extends React.Component {
  render() {
    const problemId = this.props.match
      ? this.props.match.params.id
      : this.props.params.id;
    return <StageGraph problemId={problemId} />;
  }
}
