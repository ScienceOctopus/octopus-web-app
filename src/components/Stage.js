import React, { Component } from "react";

import Publication from "./Publication";

class Stage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePublication: props.activePublicationId,
      activeStage: props.activeStageId,
      problem: props.problemId,
      stage: props.stage,
      publications: [],
    };

    fetch(
      `/api/problems/${this.state.problem}/stages/${
        this.state.stage.id
      }/publications`
    )
      .then(response => response.json())
      .then(publications => {
        this.setState({ publications: publications });
      });
  }

  render() {
    var active = (this.state.activeStage === this.state.stage.id);
    return (
      <div class="column">
        <div className={"ui " + (active ? "raised " : "") + "segment"}>
          <h4>
            {this.state.stage.name}
            <div className={"floating ui " + (active ? "teal " : "") + "label"}>
              {this.state.publications.length}
            </div>
          </h4>
          {
            this.state.publications.map(publication => <Publication activePublicationId={this.state.activePublication} publicationId={publication.id} />)
          }
        </div>
      </div>
    );
  }
}

export default Stage;
