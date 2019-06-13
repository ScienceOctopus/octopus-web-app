import React, { Component } from "react";
import PDFImagePreviewRenderer from "./PDFImagePreviewRenderer";
import styled from "styled-components";
import Api from "../api";

const SUMMARY_KEY = "summary";

class SummaryView extends Component {
  constructor(props) {
    super(props);
    //console.log("constructor(SummaryView)");

    this._isMounted = false;
    this._setStateTask = undefined;

    this.state = {
      publication: undefined,
      collaborators: new Map(),
      allCollaborators: new Map(),
      users: new Map(),
      resources: undefined,
      stage: undefined,
      schema: undefined,
    };

    this.fetchPublicationData();
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

    Api().unsubscribeClass(SUMMARY_KEY);
  }

  setState(newState, callback) {
    let task = () => super.setState(newState, callback);

    if (this._isMounted) {
      task();
    } else if (this._setStateTask === undefined) {
      this._setStateTask = task;
    } else if (callback !== undefined) {
      let oldTask = this._setStateTask;

      this._setStateTask = () => {
        oldTask();
        task();
      };
    }
  }

  static getContributions = collaborators => {
    return collaborators.reduce((map, collaborator) => {
      return map.set(collaborator.user, (map.get(collaborator.user) || 0) + 1);
    }, new Map());
  };

  static sortByLastName = (contributions, users) => {
    let knownUsers = [];

    contributions.forEach((amount, id) => {
      let user = users.get(id);

      if (user !== undefined) {
        knownUsers.push({ contributions: amount, ...user });
      }
    });

    knownUsers.sort((a, b) => {
      if (a.contributions !== b.contributions) {
        return a.contributions - b.contributions;
      }

      a = a.display_name.split(" ");
      b = b.display_name.split(" ");

      a = a[a.length - 1];
      b = b[b.length - 1];

      return a.localeCompare(b);
    });

    return knownUsers;
  };

  fetchPublicationData() {
    this.setState(
      {
        publication: undefined,
        collaborators: new Map(),
        allCollaborators: new Map(),
        users: new Map(),
      },
      () => {
        // Cache under a similar scope as the ProblemPage
        Api()
          .subscribeClass(SUMMARY_KEY, this.props.problemId)
          .publication(this.props.publicationId)
          .get()
          .then(publication => {
            publication.data = JSON.parse(publication.data);

            this.setState(
              {
                publication: publication,
              },
              () => {
                Api()
                  .subscribe(SUMMARY_KEY)
                  .problem(this.state.publication.problem)
                  .stage(this.state.publication.stage)
                  .get()
                  .then(stage =>
                    this.setState({
                      stage: stage,
                      schema: JSON.parse(stage.schema),
                    }),
                  );
              },
            );
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .resources()
          .get()
          .then(resources => {
            this.setState({
              resources: resources,
            });
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .collaborators()
          .get()
          .then(collaborators => {
            this.setState(
              { collaborators: SummaryView.getContributions(collaborators) },
              () => {
                this.state.collaborators.forEach((contributions, id) => {
                  Api()
                    .subscribe(SUMMARY_KEY)
                    .user(id)
                    .get()
                    .then(user =>
                      this.setState(state => {
                        let users = state.users;
                        users.set(id, user);
                        return { users: users };
                      }),
                    );
                });
              },
            );
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .allCollaborators()
          .get()
          .then(allCollaborators => {
            this.setState(
              {
                allCollaborators: SummaryView.getContributions(
                  allCollaborators,
                ),
              },
              () => {
                this.state.allCollaborators.forEach((contributions, id) => {
                  Api()
                    .subscribe(SUMMARY_KEY)
                    .user(id)
                    .get()
                    .then(user =>
                      this.setState(state => {
                        let users = state.users;
                        users.set(id, user);
                        return { users: users };
                      }),
                    );
                });
              },
            );
          });
      },
    );
  }

  componentDidUpdate(oldProps) {
    if (oldProps.publicationId !== this.props.publicationId) {
      this.fetchPublicationData();
    }
  }

  render() {
    // TODO: handle cases where publication may not have loaded?
    if (this.state.publication === undefined) {
      return null;
    }

    const mainResourcePresent =
      this.state.resources !== undefined && this.state.resources.length > 0;
    const stagePresent = this.state.stage !== undefined;
    const reviewPresent = this.state.publication.review;

    let metadata = null;

    if (
      this.state.publication !== {} &&
      stagePresent &&
      this.state.resources !== undefined
    ) {
      metadata = this.state.schema.map(([key, type, title, description], i) => {
        let datum = this.state.publication.data[i];

        if (datum === undefined) {
          return null;
        }

        let content;

        switch (type) {
          case "file":
            datum = this.state.resources.find(
              resource => resource.id === datum,
            );

            if (datum === undefined) {
              return null;
            }

            content = (
              <a className="ui button" href={datum.uri}>
                <i className="ui download icon" />
                Download document
              </a>
            );
            break;
          case "uri":
            datum = this.state.resources.find(
              resource => resource.id === datum,
            );

            if (datum === undefined) {
              return null;
            }

            content = <a href={datum.uri}>{datum.uri}</a>;
            break;
          case "text":
            content = datum;
            break;
          case "bool":
            content = (
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  checked={datum}
                  style={{ cursor: "default" }}
                  disabled
                />
                <label> </label>
              </div>
            );
            break;
          default:
            return null;
        }

        return (
          <section key={key} className="ui segment">
            <h3>{title}</h3>
            {description ? (
              <div style={{ marginTop: "-0.5rem" }}>{description}</div>
            ) : null}
            <div className="ui divider" />
            {content}
          </section>
        );
      });
    }

    let allCollaborators = SummaryView.sortByLastName(
      this.state.allCollaborators,
      this.state.users,
    );

    return (
      <div>
        <div className="ui divider" />
        <main className="ui main text container">
          <article>
            <h1 className="ui header">
              <StageTitle>
                {stagePresent && this.state.stage.singular}
                <ReviewTitle>{reviewPresent ? " Review" : ""}</ReviewTitle>
                {(stagePresent || reviewPresent) && ": "}
              </StageTitle>
              {this.state.publication.title}
            </h1>
            <p>
              <strong>Date added: </strong>
              {new Date(this.state.publication.created_at).toLocaleDateString()}
            </p>
            {SummaryView.sortByLastName(
              this.state.collaborators,
              this.state.users,
            ).map(user => (
              <p key={user.id}>
                <strong>Author: </strong>
                <a href={`https://orcid.org/${user.orcid}`}>
                  {user.display_name}
                </a>
              </p>
            ))}

            {mainResourcePresent && (
              <a className="ui button" href={this.state.resources[0].uri}>
                <i className="ui download icon" />
                Download document
              </a>
            )}
            <section className="ui segment">
              <h3>Summary</h3>
              <div className="ui divider" />
              {this.state.publication.summary}
            </section>
            <section className="ui segment">
              <h3>Funding Statement</h3>
              <div className="ui divider" />
              {this.state.publication.funding}
            </section>
            <section className="ui segment">
              <h3>Conflict of Interest Declaration</h3>
              <div className="ui divider" />
              {this.state.publication.conflict}
            </section>

            {metadata}

            {mainResourcePresent ? (
              <section className="ui segment">
                <PDFImagePreviewRenderer document={this.state.resources[0]} />
              </section>
            ) : (
              <section className="ui placeholder segment">
                <div className="ui icon header">
                  <i className="pencil icon" />
                  No resources were uploaded for this publication.
                </div>
              </section>
            )}

            <section className="ui segment">
              <h3>Collaborating authors in this line of research</h3>
              <div className="ui divider" />
              {allCollaborators.map((user, i) => (
                <span key={user.id}>
                  <a href={`https://orcid.org/${user.orcid}`}>
                    {user.display_name}
                  </a>
                  {user.contributions > 1 ? ` (${user.contributions})` : null}
                  {i + 1 < allCollaborators.length ? ", " : null}
                </span>
              ))}
            </section>

            <section className="ui segment">
              <h3>Publications in this line of research</h3>
              <div className="ui divider" />
              {/* TODO: use publications/:id/linksBeforeAll to get all linked publications, sort by stages and provide anchors for three dots to it */}
            </section>
          </article>
          <br />
        </main>
      </div>
    );
  }
}

const StageTitle = styled.span`
  color: var(--octopus-theme-publication);
`;

const ReviewTitle = styled.span`
  color: var(--octopus-theme-review);
`;

export default SummaryView;
