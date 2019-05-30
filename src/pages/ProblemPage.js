import React from "react";

import StageGraph from "../components/StageGraph";

export default class ProblemPage extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.location || !this.props.location.state) {
      this.state = {
        problem: undefined,
        content: {
          problem: {},
          stages: [],
        }
      };
    } else {
      this.state = this.props.location.state;
    }

    let id = props.match ? props.match.params.id : props.params.id;

    if (this.props.publication) {
      fetch(`/api/publications/${id}`)
        .then(response => response.json())
        .then(publication => this.initProblem(publication.problem, false));
    } else {
      this.initProblem(id, true);
    }
  }

  initProblem(problem, sync) {
    if (problem !== this.state.problem) {
      if (sync) {
        this.state.problem = problem;
        this.fetchProblem();
      } else {
        this.setState({ problem: problem }, this.fetchProblem);
      }
    }
  }

  fetchProblem() {
    console.log("fetch", this.state.problem);

    fetch(`/api/problems/${this.state.problem}`)
      .then(response => response.json())
      .then(problem => {
        let content = { ...this.state.content };
        content.problem = problem;
        this.setState({ content: content }, this.fetchStages);
      });
  }

  fetchStages() {
    fetch(`/api/problems/${this.state.problem}/stages`)
      .then(response => response.json())
      .then(stages => {
        stages.sort((a, b) => a.id - b.id);
        stages.forEach(stage => {
          stage.publications = [];
          stage.links = [];
        });
        let content = { ...this.state.content };
        content.stages = stages;
        this.setState({ content: content }, () => this.fetchStage(0));
      });
  }

  fetchStage(stageId) {
    if (stageId >= this.state.content.stages.length) {
      return this.fetchLinks(1);
    }

    let stage = this.state.content.stages[stageId];

    fetch(`/api/problems/${this.state.problem}/stages/${stage.id}/publications`)
      .then(response => response.json())
      .then(publications => {
        publications.forEach(
          publication =>
            (publication.created_at = new Date(
              publication.created_at,
            ).toDateString()),
        );
        let content = { ...this.state.content };
        content.stages[stageId].publications = publications;

        this.setState({ content: content }, () => this.fetchStage(stageId + 1));
      });
  }

  fetchLinks(stageId) {
    if (stageId >= this.state.content.stages.length) {
      return;
    }

    let links = [];
    let counter = [];

    let prevStagePubs = this.state.content.stages[stageId - 1].publications;
    let nextStagePubs = this.state.content.stages[stageId].publications;

    nextStagePubs.forEach(nextPub => {
      fetch(`/api/publications/${nextPub.id}/references`)
        .then(response => response.json())
        .then(references => {
          // TODO: actually use references test data

          prevStagePubs.forEach(prevPub => {
            let prev = prevStagePubs.findIndex(x => x === prevPub);
            let next = nextStagePubs.findIndex(x => x === nextPub);

            if (prev !== -1 && next !== -1) {
              links.push([prev, next]);
            }
          });

          if (++counter >= nextStagePubs.length) {
            let content = { ...this.state.content };
            content.stages[stageId - 1].linkSize = Math.max(
              prevStagePubs.length,
              nextStagePubs.length,
            );
            content.stages[stageId - 1].links = links;
            this.setState({ content: content }, () =>
              this.fetchLinks(stageId + 1),
            );
          }
        });
    });
  }

  render() {
    console.log("render id", this.props.match ? this.props.match.params.id : this.props.params.id);

    return (
      <StageGraph
        problem={this.state.content.problem}
        stages={this.state.content.stages}
        content={this.state}
      />
    );
  }
}
