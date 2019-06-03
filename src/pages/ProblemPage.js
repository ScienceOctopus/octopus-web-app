import React from "react";

import { withRouter } from "react-router-dom";

import StageGraph from "../components/StageGraph";
import SummaryView from "../components/SummaryView";

class ProblemPage extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this._setStateTask = undefined;

    if (!this.props.location || !this.props.location.state) {
      this.state = {
        problem: undefined,
        publication: undefined,
        content: {
          problem: {},
          stages: [],
          publications: new Map(),
        },
        open: true,
        measurements: undefined,
      };
    } else {
      this.state = this.props.location.state;

      this.initCheck(this.props, false, undefined, false);
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._setStateTask !== undefined) {
      let task = this._setStateTask;
      this._setStateTask = undefined;

      task();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setState(newState, callback) {
    let task = () => super.setState(newState, callback);

    if (this._isMounted) {
      task();
    } else if (this._setStateTask === undefined) {
      this._setStateTask = task;
    } else if (callback !== undefined) {
      alert("Fatal Error in ProblemPage.js");
    }
  }

  initCheck(props, selection, review, boot) {
    // id should be in params as soon as proper start page exists
    let id = Number(
      (props.match ? props.match.params.id : props.params.id) ||
        props.params.id,
    );

    if (props.publication) {
      let publication = this.state.content.publications.get(id);

      if (!publication) {
        fetch(`/api/publications/${id}`)
          .then(response => response.json())
          .then(publication => {
            let content = { ...this.state.content };

            content.publications.set(id, publication);

            this.setState({ content: content }, () =>
              this.initProblem(
                publication.problem,
                id,
                selection,
                review,
                boot,
              ),
            );
          });
      } else {
        this.initProblem(publication.problem, id, selection, review, boot);
      }
    } else {
      this.initProblem(id, undefined, selection, review, boot);
    }
  }

  initProblem(problem, publication, selection, review, boot) {
    if (publication !== undefined) {
      let review = this.state.content.publications.get(publication);

      if (review.review) {
        if (review.publication_before !== undefined) {
          return this.initCheck(
            { publication: true, params: { id: review.publication_before } },
            selection,
            review.id,
            boot,
          );
        } else {
          return fetch(`/api/publications/${review.id}/linksTo`)
            .then(response => response.json())
            .then(links => {
              let content = { ...this.state.content };

              review = content.publications.get(publication);
              review.publication_before = links[0].publication_before;
              review.publication_after = links[0].publication_after;

              this.setState(
                { content: content },
                this.initCheck(
                  {
                    publication: true,
                    params: { id: review.publication_before },
                  },
                  selection,
                  review.id,
                  boot,
                ),
              );
            });
        }
      }
    }

    if (problem !== this.state.problem) {
      this.setState(
        { problem: problem, publication: publication, review: review },
        () => this.fetchProblem(boot),
      );
    } else if (publication !== this.state.publication) {
      this.setState({ publication: publication, review: review }, () =>
        this.generateSelection(boot),
      );
    } else if (review !== this.state.review) {
      this.setState({ review: review });
    }
  }

  fetchProblem(boot) {
    fetch(`/api/problems/${this.state.problem}`)
      .then(response => response.json())
      .then(problem => {
        let content = { ...this.state.content };
        content.problem = problem;
        this.setState({ content: content }, () => this.fetchStages(boot));
      });
  }

  fetchStages(boot) {
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

        this.setState({ content: content }, () => this.fetchStage(0, boot));
      });
  }

  fetchStage(stageId, boot) {
    if (stageId >= this.state.content.stages.length) {
      return this.fetchLinks(1, boot);
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
          ).toLocaleDateString();
          publication.reviews = undefined;
        });
        content.stages[stageId].publications = publications;

        this.setState({ content: content }, () =>
          this.fetchStage(stageId + 1, boot),
        );
      });
  }

  fetchLinks(stageId, boot) {
    if (stageId >= this.state.content.stages.length) {
      return this.generateSelection(boot);
    }

    let links = [];
    let counter = [];

    let prevStagePubs = this.state.content.stages[stageId - 1].publications;
    let nextStagePubs = this.state.content.stages[stageId].publications;

    if (nextStagePubs.length <= 0) {
      return this.fetchLinks(stageId + 1, boot);
    }

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
              this.fetchLinks(stageId + 1, boot),
            );
          }
        });
    });
  }

  generateSelection(boot) {
    if (this.state.publication === undefined) {
      if (boot) {
        this.props.history.replace(this.props.location.pathname, this.state);
      }

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
    reachable[stageId] = new Map([[publicationId, 0]]);

    let content = { ...this.state.content };

    // Generate graph of pubs linked to selected one and accumulate their degrees
    for (let prev = stageId - 1; prev >= 0; prev--) {
      let next_reachable = reachable[prev + 1];
      let prev_reachable = new Map();

      content.stages[prev].links.forEach(([prev, next]) => {
        if (next_reachable.has(next)) {
          prev_reachable.set(prev, (prev_reachable.get(prev) || 0) + 1);
          next_reachable.set(next, (next_reachable.get(next) || 0) + 1);
        }
      });

      reachable[prev] = prev_reachable;
    }

    for (let next = stageId + 1; next < content.stages.length; next++) {
      let prev_reachable = reachable[next - 1];
      let next_reachable = new Map();

      content.stages[next - 1].links.forEach(([prev, next]) => {
        if (prev_reachable.has(prev)) {
          prev_reachable.set(prev, (prev_reachable.get(prev) || 0) + 1);
          next_reachable.set(next, (next_reachable.get(next) || 0) + 1);
        }
      });

      reachable[next] = next_reachable;
    }

    let sizes = reachable.map(stage => stage.size);

    // Start from first stage and select the three pubs with the highest degree
    if (content.stages.length) {
      reachable[0] = new Map(
        [...reachable[0].entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
      );
    }

    const linkFromPrevStageExistsToPub = (pub, stageId) =>
      content.stages[stageId - 1].links.find(
        ([prev, next]) => next === pub && reachable[stageId - 1].has(prev),
      ) !== undefined;

    for (let i = 1; i < content.stages.length; i++) {
      let ok_reachable = [];
      let no_reachable = [];

      // Partition next stage's pubs into still reachable ones and now unreachable ones
      for (let [pub, degree] of reachable[i]) {
        if (linkFromPrevStageExistsToPub(pub, i)) {
          ok_reachable.push([pub, degree]);
        } else {
          no_reachable.push([pub, degree]);
        }
      }

      // Select the three pubs with the highest degree from the reachable ones, fill up with now unreachable ones
      ok_reachable = ok_reachable.sort((a, b) => b[1] - a[1]).slice(0, 3);

      if (ok_reachable.length < 3) {
        ok_reachable.concat(
          no_reachable
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3 - ok_reachable.length),
        );
      }

      reachable[i] = new Map(ok_reachable);
    }

    let links = [];

    const retainLinksWhichConnectReachablePubs = (links, stageId) =>
      links.filter(([prev, next]) => {
        return reachable[stageId - 1].has(prev) && reachable[stageId].has(next);
      });

    for (let i = 1; i < content.stages.length; i++) {
      links.push(
        retainLinksWhichConnectReachablePubs(content.stages[i - 1].links, i),
      );
    }

    reachable = reachable.map(map =>
      [...map].sort((a, b) => b[1] - a[1]).map(pub => pub[0]),
    );
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
        size: sizes[stageId],
      };
    });

    this.setState({ content: content }, () => this.fetchReviews(boot));
  }

  fetchReviews(boot) {
    if (this.state.publication === undefined) {
      return;
    }

    let publication = this.state.content.publications.get(
      this.state.publication,
    );

    if (publication.reviews !== undefined) {
      return;
    }

    fetch(`/api/publications/${this.state.publication}/reviews`)
      .then(response => response.json())
      .then(reviews => {
        let content = { ...this.state.content };

        reviews.forEach(review => {
          review.created_at = new Date(review.created_at).toLocaleDateString();

          content.publications.set(review.id, review);
        });

        if (boot && this.state.review !== undefined) {
          let review = reviews.splice(
            reviews.findIndex(x => x.id === this.state.review),
            1,
          )[0];

          reviews.unshift(review);
        }

        content.stages
          .find(stage => stage.id === publication.stage)
          .publications.find(
            pub => pub.id === publication.id,
          ).reviews = reviews;

        this.setState(
          { content: content },
          boot
            ? () =>
                this.props.history.replace(
                  this.props.location.pathname,
                  this.state,
                )
            : undefined,
        );
      });
  }

  componentWillReceiveProps(nextProps) {
    this.initCheck(nextProps, true, undefined, false);
  }

  render() {
    let helper = this.ensureMeasurements();

    if (helper !== false) {
      return helper;
    }

    let publication = null;

    if (this.state.publication !== undefined) {
      publication = (
        <SummaryView
          publicationId={
            this.state.review !== undefined
              ? this.state.review
              : this.state.publication
          }
	  stages={this.state.content.stages}
        />
      );
    }

    return (
      <div>
        <StageGraph
          problem={this.state.content.problem}
          stages={this.state.content.stages}
          open={this.state.open}
          toggleOpen={() => this.setState({ open: !this.state.open })}
          content={this.state}
        />
        {publication}
      </div>
    );
  }

  ensureMeasurements() {
    if (this.state.measurements !== undefined) {
      return false;
    }

    return (
      <div
        className="ui one column grid"
        style={{ overflow: "hidden", maxHeight: 0, margin: 0 }}
        ref={ref => {
          if (!ref) {
            return;
          }

          let root = ref.children[0].getBoundingClientRect();
          let publications = [
            ...ref.children[0].children[0].children[1].children,
          ].map(child => child.getBoundingClientRect());
          let derheider = ref.children[0].children[0].children[1].getBoundingClientRect();
          let container = ref.children[0].children[0].getBoundingClientRect();

          let offset = publications[0].top - root.top;
          let height = publications[0].bottom - publications[0].top;
          let margin = publications[1].top - publications[0].bottom;
          let siding = publications[0].left - root.left;
          let heider = derheider.bottom - derheider.top;
          let tainer = container.bottom - container.top + margin * 2;

          this.setState(
            {
              measurements: {
                offset: offset,
                height: height,
                margin: margin,
                siding: siding,
                heider: heider,
                tainer: tainer,
              },
            },
            () => this.initCheck(this.props, false, undefined, true),
          );
        }}
      >
        <div className="column" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="ui segment">
            <h4 style={{ marginBottom: 0 }}>
              &#x200b;
              <div className="floating ui label">&#x200b;</div>
            </h4>
            <div style={{ marginTop: "1rem", marginBottom: "-1rem" }}>
              <div
                style={{
                  padding: "1em 1em",
                  borderRadius: "0.25rem",
                  border: "1px solid",
                  fontSize: "0.75rem",
                  paddingBottom: 0,
                  marginBottom: "1rem",
                }}
                className="ui segment"
              >
                <h5>&#x200b;</h5>
                <div className="meta">&#x200b;</div>
                <div className="description" style={{ height: "3rem" }}>
                  &#x200b;
                </div>
              </div>
              <div
                style={{
                  padding: "1em 1em",
                  borderRadius: "0.25rem",
                  border: "1px solid",
                  fontSize: "0.75rem",
                  paddingBottom: 0,
                  marginBottom: "1rem",
                }}
                className="ui segment"
              >
                <h5>&#x200b;</h5>
                <div className="meta">&#x200b;</div>
                <div className="description" style={{ height: "3rem" }}>
                  &#x200b;
                </div>
              </div>
              <div
                style={{
                  padding: "1em 1em",
                  borderRadius: "0.25rem",
                  border: "1px solid",
                  fontSize: "0.75rem",
                  paddingBottom: 0,
                  marginBottom: "1rem",
                }}
                className="ui segment"
              >
                <h5>&#x200b;</h5>
                <div className="meta">&#x200b;</div>
                <div className="description" style={{ height: "3rem" }}>
                  &#x200b;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProblemPage);
