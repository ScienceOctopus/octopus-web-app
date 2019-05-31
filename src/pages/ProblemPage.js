import React from "react";

import StageGraph from "../components/StageGraph";
import SummaryView from "../components/SummaryView";

//import { Route } from "react-router-dom";

//import UploadPage from "./UploadPage";

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

    this.initCheck(this.props, true, false);
  }

  initCheck(props, sync, selection) {
    let id = Number(props.match ? props.match.params.id : props.params.id);

    if (props.publication) {
      let publication = this.state.content.publications.get(id);

      if (!publication) {
        fetch(`/api/publications/${id}`)
          .then(response => response.json())
          .then(publication =>
            this.initProblem(publication.problem, id, false, selection),
          );
      } else {
        this.initProblem(publication.problem, id, sync, selection);
      }
    } else {
      this.initProblem(id, undefined, sync, selection);
    }
  }

  initProblem(problem, publication, sync, selection) {
    let publicationChanged = publication !== this.state.publication;

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
    } else if (publicationChanged) {
      if (sync) {
        this.state.publication = publication;

        this.generateSelection();
      } else {
        this.setState({ publication: publication }, this.generateSelection);
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
          stage.selection = {
            publications: [],
            links: [],
          };
        });
        let content = { ...this.state.content };
        content.publications = new Map();
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
      return this.generateSelection();
    }

    let links = [];
    let counter = [];

    let prevStagePubs = this.state.content.stages[stageId - 1].publications;
    let nextStagePubs = this.state.content.stages[stageId].publications;

    nextStagePubs.forEach(nextPub => {
      fetch(`/api/publications/${nextPub.id}/linksTo`)
        .then(response => response.json())
        .then(slinks => {
          let next = nextStagePubs.findIndex(x => x === nextPub);

          slinks.forEach(link => {
            let prev = prevStagePubs.findIndex(
              x => x.id === link.publication_before,
            );

            if (prev !== -1 && next !== -1) {
              links.push([prev, next]);
            }
          });

          if (++counter >= nextStagePubs.length) {
            let content = { ...this.state.content };
            content.stages[stageId - 1].links = links;
            this.setState({ content: content }, () =>
              this.fetchLinks(stageId + 1),
            );
          }
        });
    });
  }

  generateSelection() {
    if (this.state.publication === undefined) {
      return;
    }

    let stageId = this.state.content.publications.get(this.state.publication)
      .stage;
    stageId = this.state.content.stages.findIndex(x => x.id === stageId);

    let stage = this.state.content.stages[stageId];

    let publicationId = stage.publications.findIndex(
      x => x.id === this.state.publication,
    );

    let reachable = [];
    reachable[stageId] = new Set([publicationId]);

    let content = { ...this.state.content };

    for (let prev = stageId - 1; prev >= 0; prev--) {
      let next_reachable = reachable[prev + 1];
      let prev_reachable = new Set();

      content.stages[prev].links.forEach(([prev, next]) => {
        if (next_reachable.has(next)) {
          prev_reachable.add(prev);
        }
      });

      reachable[prev] = new Set([...prev_reachable].slice(0, 3));
    }

    for (let next = stageId + 1; next < content.stages.length; next++) {
      let prev_reachable = reachable[next - 1];
      let next_reachable = new Set();

      content.stages[next - 1].links.forEach(([prev, next]) => {
        if (prev_reachable.has(prev)) {
          next_reachable.add(next);
        }
      });

      reachable[next] = new Set([...next_reachable].slice(0, 3));
    }

    let links = [];

    for (let i = 1; i < this.state.content.stages.length; i++) {
      links.push(
        content.stages[i - 1].links.filter(([prev, next]) => {
          return reachable[i - 1].has(prev) && reachable[i].has(next);
        }),
      );
    }

    reachable = reachable.map(set => [...set]);
    links = links.map((links, stageId) =>
      links.map(([prev, next]) => [
        reachable[stageId].findIndex(x => x === prev),
        reachable[stageId + 1].findIndex(x => x === next),
      ]),
    );

    content.stages.forEach((stage, stageId) => {
      stage.selection = {
        publications: reachable[stageId],
        links: links[stageId] || [],
      };
    });

    this.setState({ content: content });
  }

  componentWillReceiveProps(nextProps) {
    this.initCheck(nextProps, false, true);
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
