import React from "react";

import StageGraph from "../components/StageGraph";
import SummaryView from "../components/SummaryView";

export default class ProblemPage extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.location || !this.props.location.state) {
      this.state = {
        problem: undefined,
        publication: undefined,
        content: {
          problem: {},
          stages: [],
          publications: new Map(),
        },
      };
    } else {
      this.state = this.props.location.state;
    }

    this.initCheck(this.props, true);
  }

  initCheck(props, sync) {
    let id = Number(props.match ? props.match.params.id : props.params.id);

    if (props.publication) {
      let publication = this.state.content.publications.get(id);

      if (!publication) {
        fetch(`/api/publications/${id}`)
          .then(response => response.json())
          .then(publication =>
            this.initProblem(publication.problem, id, false),
          );
      } else {
        this.initProblem(publication.problem, id, sync);
      }
    } else {
      this.initProblem(id, undefined, sync);
    }
  }

  initProblem(problem, publication, sync) {
    if (problem !== this.state.problem) {
      if (sync) {
        this.state.problem = problem;
        this.state.publication = publication;
        this.fetchProblem();
      } else {
        this.setState(
          { problem: problem, publication: publication },
          this.fetchProblem,
        );
      }
    } else if (publication !== this.state.publication) {
      if (sync) {
        this.state.publication = publication;
      } else {
        this.setState({ publication: publication });
      }
    }
  }

  fetchProblem() {
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
        let content = { ...this.state.content };
        publications.forEach(publication => {
          content.publications.set(publication.id, publication);
          publication.created_at = new Date(
            publication.created_at,
          ).toDateString();
        });
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
      fetch(`/api/publications/${nextPub.id}/linkedBy`)
        .then(response => response.json())
        .then(links => {
          let next = nextStagePubs.findIndex(x => x === nextPub);

          links.forEach(link => {
            let prev = prevStagePubs.findIndex(
              x => x === link.publication_before,
            );

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

  componentWillReceiveProps(nextProps) {
    this.initCheck(nextProps, false);
  }

  render() {
    let publication = null;

    if (this.state.publication !== undefined) {
      publication = <SummaryView publicationId={this.state.publication} />;
    }

    return (
      <div>
        <StageGraph
          problem={this.state.content.problem}
          stages={this.state.content.stages}
          content={this.state}
        />
        {publication}
      </div>
    );
  }
}
