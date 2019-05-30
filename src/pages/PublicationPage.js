import React from "react";
import StageGraph from "../components/StageGraph";
import SummaryView from "../components/SummaryView";

export default class PublicationPage extends React.Component {
  render() {
    const publicationId = this.props.match
      ? this.props.match.params.id
      : this.props.params.id;
      
    return (
      <div>
      <StageGraph activeStageId={2} problemId={4} />
      <SummaryView publicationId={publicationId} />
      </div>
    );
  }
}