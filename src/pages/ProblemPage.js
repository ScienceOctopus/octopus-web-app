import React, { Component } from "react";

import StageGraph from "../components/StageGraph";
import SummaryView from "../components/SummaryView";
import EditPublicationView from "../components/EditPublicationView";
import ForceGraph2D from "react-force-graph-2d";
import Modal from "../components/Modal";
import Api from "../api";
import withState from "../withState";
import { RouterURI, generateLocalizedPath } from "../urls/WebsiteURIs";
import { interpolateCool as stageColour } from "d3-scale-chromatic";
import { ColourScheme } from "../GlobalStyle";
import _ from "underscore";

const PROBLEM_KEY = "problem";

// https://stackoverflow.com/a/45140101
function strokeStar(ctx, x, y, r, n, inset) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.moveTo(0, 0 - r);
  for (var i = 0; i < n; i++) {
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - r * inset);
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

class ProblemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      problem: undefined,
      stage: undefined,
      publication: undefined,
      content: {
        problem: {},
        stages: [],
        publications: new Map(),
        loading: true,
      },
      open: true,
      measurements: global.measurements,
      modal: {
        width: global.innerWidth,
        height: global.innerHeight,
      },
      graph: {
        nodes: [
          { id: 0, colour: ColourScheme.problem, middle: false, review: false },
        ],
        links: [],
      },
      modalOpen: false,
      graphHoverBool: false,
      graphHoverTitle: null,
    };

    global.addEventListener("resize", this.resize);

    if (this.state.measurements !== undefined) {
      this.initCheck(this.props, false, undefined);
    }
  }

  resize = () => {
    if (this.modalRef && this.state.modalOpen) {
      this.setState({
        modal: {
          width: this.modalRef.clientWidth,
          height: this.modalRef.clientHeight,
        },
      });
    }
  };

  componentWillUnmount() {
    Api().unsubscribeClass(PROBLEM_KEY);

    global.removeEventListener("resize", this.resize);
  }

  initCheck(props, selection, review) {
    let id = Number(props.match ? props.match.params.id : props.params.id);

    if (props.publication) {
      let publication = this.state.content.publications.get(id);

      if (!publication) {
        Api()
          .publication(id)
          .get()
          .then(publication => {
            this.setState(
              state => {
                let content = { ...state.content };

                content.publications.set(id, publication);
                return { content: content };
              },
              () =>
                this.initProblem(publication.problem, id, selection, review),
            );
          });
      } else {
        this.initProblem(publication.problem, id, selection, review);
      }
    } else {
      this.initProblem(id, undefined, selection, review);
    }
  }

  initProblem(problem, publication, selection, review) {
    let stage = undefined;

    if (publication !== undefined) {
      let review = this.state.content.publications.get(publication);

      stage = review.stage;

      if (review.review) {
        if (review.publication_before !== undefined) {
          return this.initCheck(
            { publication: true, params: { id: review.publication_before } },
            selection,
            review.id,
          );
        } else {
          return Api()
            .publication(review.id)
            .linksBefore()
            .get()
            .then(links => {
              let content = { ...this.state.content };

              review = content.publications.get(publication);
              review.publication_before = links[0].publication_before;
              review.publication_after = links[0].publication_after;

              this.setState(
                state => {
                  let content = { ...state.content };

                  review = content.publications.get(publication);
                  review.publication_before = links[0].publication_before;
                  review.publication_after = links[0].publication_after;

                  return { content: content };
                },
                () =>
                  this.initCheck(
                    {
                      publication: true,
                      params: { id: review.publication_before },
                    },
                    selection,
                    review.id,
                  ),
              );
            });
        }
      }
    }

    if (problem !== this.state.problem) {
      this.setState(
        {
          problem: problem,
          stage: stage,
          publication: publication,
          review: review,
        },
        () => this.fetchProblem(),
      );
    } else if (publication !== this.state.publication) {
      this.setState(
        { stage: stage, publication: publication, review: review },
        () => this.generateSelection(),
      );
    } else if (review !== this.state.review) {
      this.setState({ stage: stage, review: review });
    }
  }

  handleProblemChange = problem => state => {
    let content = state.content;

    content.problem = problem;

    return { content: content };
  };

  handleStagesChange = stages => state => {
    let content = state.content;

    if (state.content.stages.length <= 0) {
      stages.sort((a, b) => a.order - b.order);

      stages.forEach(stage => {
        stage.publications = [];
        stage.links = [];
        stage.selection = {
          publications: [],
          links: [],
          size: 0,
          loading: true,
        };
        stage.loading = true;
      });

      content.stages = stages;
      content.loading = false;
    } else {
      let newStages = new Map(stages.map(stage => [stage.id, stage]));

      content.stages.forEach(stage =>
        Object.assign(stage, newStages.get(stage.id)),
      );
    }

    return { content: content };
  };

  handleStagePublicationsChange = (stageId, publications) => state => {
    let content = state.content;

    publications.sort((a, b) => a.id - b.id);

    publications.forEach(publication => {
      content.publications.set(publication.id, publication);
    });

    let stage = content.stages.find(stage => stage.id === stageId);

    if (stage === undefined) {
      return {};
    }

    if (stage.publications.length <= 0) {
      stage.publications = publications;
      stage.loading = false;
      stage.selection.loading = true;
    } else if (
      !_.isEqual(
        publications.map(pub => pub.id),
        stage.publications.map(pub => pub.id),
      )
    ) {
      let oldReviews = stage.publications.map(pub => [pub.id, pub.reviews]);
      stage.publications = publications.map(pub =>
        Object.assign(pub, { reviews: oldReviews.get(pub.id) }),
      );

      stage.selection.loading = true;
    } else {
      stage.publications.forEach((pub, i) =>
        Object.assign(pub, publications[i]),
      );
    }

    return { content: content };
  };

  handleLinksChange = (stageId, publicationId, links) => state => {
    let content = state.content;

    let nextStage = content.stages.findIndex(stage => stage.id === stageId);

    if (nextStage < 1) {
      return {};
    }

    let prevStage = content.stages[nextStage - 1];
    nextStage = content.stages[nextStage];

    let next = nextStage.publications.findIndex(
      pub => pub.id === publicationId,
    );

    if (next === -1) {
      return {};
    }

    let nextPublication = nextStage.publications[next];

    let newLinks = [];

    links.forEach(link => {
      let prev = prevStage.publications.findIndex(
        pub => pub.id === link.publication_before,
      );

      if (prev !== -1) {
        newLinks.push([prev, next]);
      }
    });

    if (_.intersection(prevStage.links, newLinks).length !== newLinks.length) {
      prevStage.links = newLinks.concat(
        prevStage.links.filter(link => link[1] !== next),
      );
      prevStage.selection.loading = true;

      return { content: content };
    }

    return {};
  };

  handleReviewsChange = (stageId, publicationId, reviews) => state => {
    let content = state.content;

    let stage = content.stages.find(stage => stage.id === stageId);

    if (stage === undefined) {
      return {};
    }

    let publication = stage.publications.find(pub => pub.id === publicationId);

    if (publication === undefined) {
      return {};
    }

    reviews.sort((a, b) => a.id - b.id);

    reviews.forEach(review => content.publications.set(review.id, review));

    if (
      publication.reviews === undefined &&
      state.review !== undefined &&
      publication.id === state.publication
    ) {
      let review = reviews.splice(
        reviews.findIndex(x => x.id === state.review),
        1,
      )[0];

      reviews.unshift(review);
    }

    if (
      publication.reviews === undefined ||
      !_.isEqual(
        reviews.map(review => review.id).sort(),
        publication.reviews.map(review => review.id).sort(),
      )
    ) {
      publication.reviews = reviews;
    } else {
      publication.reviews.forEach((review, i) =>
        Object.assign(review, reviews[i]),
      );
    }

    return { content: content };
  };

  fetchProblem() {
    let done = false;

    Api()
      .subscribeClass(PROBLEM_KEY, this.state.problem)
      .problem(this.state.problem)
      .get()
      .then(problems =>
        this.setState(this.handleProblemChange(problems), () => {
          if (!done) {
            done = true;
            this.fetchStages();
          }
        }),
      );
  }

  fetchStages() {
    let done = false;

    Api()
      .subscribe(PROBLEM_KEY)
      .problem(this.state.problem)
      .stages()
      .get()
      .then(stages =>
        this.setState(this.handleStagesChange(stages), () => {
          if (!done) {
            done = true;
            this.fetchStagePublications();
          }
        }),
      );
  }

  fetchStagePublications() {
    let done = new Array(this.state.content.stages.length).fill(false);

    this.state.content.stages.forEach((stage, i) => {
      Api()
        .subscribe(PROBLEM_KEY)
        .problem(this.state.problem)
        .stage(stage.id)
        .publications()
        .get()
        .then(publications =>
          this.setState(
            this.handleStagePublicationsChange(stage.id, publications),
            () => {
              if (!done[i]) {
                done[i] = true;

                if (done.every(x => x)) {
                  this.fetchLinks();
                }
              } else {
                this.fetchLinks();
              }
            },
          ),
        );
    });
  }

  fetchLinks() {
    let done = this.state.content.stages
      .slice(1)
      .map(stage => new Array(stage.publications.length + 1).fill(false));

    this.state.content.stages.slice(1).forEach((stage, i) => {
      stage.publications.forEach((pub, j) => {
        Api()
          .subscribe(PROBLEM_KEY)
          .publication(pub.id)
          .linksBefore()
          .get()
          .then(links =>
            this.setState(
              this.handleLinksChange(stage.id, pub.id, links),
              () => {
                if (!done[i][j + 1]) {
                  done[i][j + 1] = true;

                  if (done[i].slice(1).every(x => x)) {
                    done[i][0] = true;

                    if (done.every(x => x[0])) {
                      this.fetchReviews();
                    }
                  }
                } else {
                  this.fetchReviews();
                }
              },
            ),
          );
      });
    });
  }

  fetchReviews() {
    let done = this.state.content.stages.map(stage =>
      new Array(stage.publications.length + 1).fill(false),
    );

    this.state.content.stages.forEach((stage, i) => {
      stage.publications.forEach((pub, j) => {
        Api()
          .subscribe(PROBLEM_KEY)
          .publication(pub.id)
          .reviews()
          .get()
          .then(reviews =>
            this.setState(
              this.handleReviewsChange(stage.id, pub.id, reviews),
              () => {
                if (!done[i][j + 1]) {
                  done[i][j + 1] = true;

                  if (done[i].slice(1).every(x => x)) {
                    done[i][0] = true;

                    if (done.every(x => x[0])) {
                      this.generateSelection();
                    }
                  }
                } else {
                  this.generateSelection();
                }
              },
            ),
          );
      });
    });
  }

  generateSelection() {
    if (this.state.publication === undefined) {
      return this.generateGraph();
    }

    this.setState(
      state => {
        let publication = state.content.publications.get(state.publication);

        // Publication was just added but has not been loaded into cached data yet
        if (publication === undefined) {
          return;
        }

        let stageId = publication.stage;
        stageId = state.content.stages.findIndex(x => x.id === stageId);

        let stage = state.content.stages[stageId];

        let publicationId = stage.publications.findIndex(
          x => x.id === state.publication,
        );

        let reachable = [];
        reachable[stageId] = new Map([[publicationId, 0]]);

        let content = { ...state.content };

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
            return (
              reachable[stageId - 1].has(prev) && reachable[stageId].has(next)
            );
          });

        for (let i = 1; i < content.stages.length; i++) {
          links.push(
            retainLinksWhichConnectReachablePubs(
              content.stages[i - 1].links,
              i,
            ),
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
            loading: false,
          };
        });
        return { content: content };
      },
      () => this.generateGraph(),
    );
  }

  generateGraph() {
    this.setState(state => {
      let nodes = [
        { id: 0, colour: ColourScheme.problem, middle: false, review: false },
      ];
      let links = [];

      this.state.content.stages.forEach((stage, i) => {
        let middle =
          i === Math.floor((this.state.content.stages.length - 1) / 2);

        stage.publications.forEach(publication => {
          nodes.push({
            id: publication.id,
            colour: stageColour((i + 1) / this.state.content.stages.length),
            middle: middle,
          });

          publication.reviews.forEach(review => {
            nodes.push({
              id: review.id,
              colour: ColourScheme.reviewHighlight,
              middle: false,
              review: true,
            });

            links.push({
              source: publication.id,
              target: review.id,
            });
          });
        });

        if (i <= 0) {
          stage.publications.forEach(publication =>
            links.push({ source: 0, target: publication.id }),
          );
        }

        // Links cached but new publications still loading
        if (
          stage.links.length > 0 &&
          !this.state.content.stages[i].loading &&
          !this.state.content.stages[i + 1].loading
        ) {
          stage.links.forEach(link =>
            links.push({
              source: this.state.content.stages[i].publications[link[0]].id,
              target: this.state.content.stages[i + 1].publications[link[1]].id,
            }),
          );
        }
      });

      let newNodes = new Set(nodes.map(node => node.id));

      // Only difference in node currently checked
      if (
        nodes.length !== this.state.graph.nodes.length ||
        this.state.graph.nodes.some(node => !newNodes.has(node.id))
      ) {
        return { graph: { nodes: nodes, links: links } };
      }

      return {};
    });
  }

  componentWillReceiveProps(nextProps) {
    let new_id = nextProps.match
      ? nextProps.match.params.id
      : nextProps.params.id;
    let new_pub = nextProps.publication;

    let cur_id = this.props.match
      ? this.props.match.params.id
      : this.props.params.id;
    let cur_pub = this.props.publication;

    if (new_id !== cur_id || new_pub !== cur_pub) {
      this.initCheck(nextProps, true, undefined);
    }
  }

  render() {
    let helper = this.ensureMeasurements();

    if (helper !== false) {
      return helper;
    }

    let publication = null;

    if (
      this.state.publication !== undefined &&
      this.state.problem !== undefined &&
      this.state.content.problem.id === this.state.problem
    ) {
      let pub = this.state.content.publications.get(
        this.state.review !== undefined
          ? this.state.review
          : this.state.publication,
      );

      if (pub) {
        if (pub.draft) {
          publication = (
            <EditPublicationView
              publicationId={pub.id}
              problemId={this.state.problem}
            />
          );
        } else {
          publication = (
            <SummaryView
              problemId={this.state.problem}
              publicationId={pub.id}
            />
          );

          if (global.session.user !== undefined) {
            Api()
              .user(global.session.user.id)
              .notificationForPublication(pub.id)
              .delete();
          }
        }
      }
    }

    return (
      <div>
        <Modal
          modalRef={this.modalRefSetter}
          show={this.state.modalOpen}
          onClose={() =>
            this.setState({ modalOpen: false }, () =>
              document.getElementById("root").classList.remove("modal-open"),
            )
          }
          backgroundColor="#000"
          overflowX="hidden"
          overflowY="hidden"
          padding={0}
          children={
            <>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  zIndex: 1,
                  margin: "1rem",
                  pointerEvents: "none",
                  width: "calc(100% - 2rem)",
                  opacity: this.state.graphHoverBool ? 1 : 0,
                  transition: "opacity 0.3s ease-in-out 0s",
                }}
              >
                <h3
                  style={{
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {this.state.graphHoverTitle}
                </h3>
              </div>
              <ForceGraph2D
                ref={fg => {
                  if (fg) {
                    fg.d3Force("link").distance(link =>
                      link.source.review || link.target.review ? 10 : 30,
                    );
                  }
                }}
                width={this.state.modal.width * 0.6}
                height={this.state.modal.height - this.state.modal.width * 0.1}
                graphData={this.state.graph}
                backgroundColor="#000"
                nodeVal={node => (node.review ? 2 : 4)}
                linkColor={() => "#fff"}
                linkCanvasObject={(link, ctx, scale) => {
                  if (
                    link.source.id === undefined ||
                    link.target.id === undefined
                  )
                    return;

                  let gradient = ctx.createLinearGradient(
                    link.source.x,
                    link.source.y,
                    link.target.x,
                    link.target.y,
                  );
                  gradient.addColorStop(0, link.source.colour);
                  gradient.addColorStop(1, link.target.colour);

                  ctx.strokeStyle = gradient;
                  ctx.lineWidth = 1;

                  ctx.beginPath();
                  ctx.moveTo(link.source.x, link.source.y);
                  ctx.lineTo(link.target.x, link.target.y);

                  ctx.stroke();
                }}
                linkDirectionalParticles={1}
                nodeCanvasObject={(node, ctx, scale) => {
                  ctx.fillStyle = node.colour;

                  if (node.id === 0) {
                    strokeStar(ctx, node.x, node.y, 4, 16, 2);
                  } else if (node.middle) {
                    ctx.fillRect(node.x - 4, node.y - 4, 8, 8);
                  } else {
                    ctx.beginPath();
                    ctx.arc(
                      node.x,
                      node.y,
                      node.review ? 2 : 4,
                      0,
                      2 * Math.PI,
                      false,
                    );
                    ctx.fill();
                  }
                }}
                onNodeHover={node => {
                  let state = { graphHoverBool: node !== null };

                  if (node) {
                    if (node.id === 0) {
                      state.graphHoverTitle = (
                        <>
                          <span
                            style={{ color: "var(--octopus-theme-problem)" }}
                          >
                            Area of research:
                          </span>{" "}
                          <span style={{ fontWeight: "initial" }}>
                            {this.state.content.problem.title}
                          </span>
                        </>
                      );
                    } else {
                      let publication = this.state.content.publications.get(
                        node.id,
                      );
                      let stage = this.state.content.stages.find(
                        stage => stage.id === publication.stage,
                      );

                      state.graphHoverTitle = (
                        <>
                          <span
                            style={{
                              color: "var(--octopus-theme-publication)",
                            }}
                          >
                            {stage.singular}
                          </span>
                          <span
                            style={{ color: "var(--octopus-theme-review)" }}
                          >
                            {publication.review ? " Review" : ""}
                          </span>
                          <span style={{ color: "var(--octopus-theme-draft)" }}>
                            {publication.draft ? " Draft" : ""}
                          </span>
                          <span
                            style={{
                              color: "var(--octopus-theme-publication)",
                            }}
                          >
                            :
                          </span>{" "}
                          <span style={{ fontWeight: "initial" }}>
                            {publication.title}
                          </span>
                        </>
                      );
                    }
                  }

                  this.setState(state);
                }}
                onNodeClick={node => {
                  if (node.id === 0) {
                    this.props.history.push(
                      generateLocalizedPath(RouterURI.Problem, {
                        id: this.state.problem,
                      }),
                    );
                  } else {
                    this.props.history.push(
                      generateLocalizedPath(RouterURI.Publication, {
                        id: node.id,
                      }),
                    );
                  }
                }}
              />
            </>
          }
        />
        <StageGraph
          problem={this.state.content.problem}
          stages={this.state.content.stages}
          open={this.state.open}
          toggleOpen={() => this.setState({ open: !this.state.open })}
          openMap={() =>
            this.setState({ modalOpen: true }, () =>
              document.getElementById("root").classList.add("modal-open"),
            )
          }
          content={this.state}
        />
        {publication}
      </div>
    );
  }

  modalRefSetter = ref => {
    if (!ref || ref === this.modalRef) {
      return;
    }

    this.modalRef = ref;

    this.resize();
  };

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

          global.measurements = {
            offset: offset,
            height: height,
            margin: margin,
            siding: siding,
            heider: heider,
            tainer: tainer,
          };

          this.setState(
            {
              measurements: global.measurements,
            },
            () => this.initCheck(this.props, false, undefined),
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

export default withState(ProblemPage);
