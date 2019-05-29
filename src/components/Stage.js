import React, { Component } from "react";

import Publication from "./Publication";

class Stage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    return (
      <div class="column">
        <div class="ui segment">
          <h4>
            {this.state.stage.name}
            <div class="floating ui label">
              {this.state.publications.length}
            </div>
          </h4>
          {
            this.state.publications.map(publication => <Publication publicationId={publication.id} />)
          }
        </div>
      </div>
    );
  }
}

export default Stage;
