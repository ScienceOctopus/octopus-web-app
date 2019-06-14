import React, { Component } from "react";
import PDFImagePreviewRenderer from "./PDFImagePreviewRenderer";
import styled from "styled-components";
import Api from "../api";
import withState from "../withState";

const EDIT_KEY = "edit";

class EditPublicationView extends Component {
  constructor(props) {
    super(props);
    //console.log("constructor(SummaryView)");

    this.state = {
      publication: undefined,
      collaborators: [],
      resources: undefined,
      stage: undefined,
      schema: undefined,
      signoffs: [],
      signoffsRemaining: [],
    };

    this.fetchPublicationData();
  }

  componentWillUnmount() {
    Api().unsubscribeClass(EDIT_KEY);
  }

  fetchPublicationData() {
    this.setState({ publication: undefined, collaborators: [] });

    Api()
      .subscribeClass(EDIT_KEY, this.props.publicationId)
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
              .subscribe(EDIT_KEY)
              .problem(this.state.publication.problem)
              .stage(this.state.publication.stage)
              .get()
              .then(stage =>
                this.setState({
                  stage: stage,
                  schema: JSON.parse(stage.schema),
                })
              );
          }
        );
      });

    Api()
      .subscribe(EDIT_KEY)
      .publication(this.props.publicationId)
      .resources()
      .get()
      .then(resources => {
        this.setState({
          resources: resources,
        });
      });

    Api()
      .subscribe(EDIT_KEY)
      .publication(this.props.publicationId)
      .collaborators()
      .get()
      .then(collaborators => {
        collaborators.forEach(collaborator => {
          Api()
            .subscribe(EDIT_KEY)
            .user(collaborator.user)
            .get()
            .then(user => {
              this.setState(
                state => {
                  var augmented = state;
                  augmented.collaborators = augmented.collaborators.filter(
                    collaborator => collaborator.id !== user.id
                  );
                  augmented.collaborators.push(user);
                  return augmented;
                },
                () => {}
              );
            });
        });
      });

    Api()
      .subscribe(EDIT_KEY)
      .publication(this.props.publicationId)
      .signoffs()
      .get()
      .then(signoffs => {
        signoffs.forEach(signoff => {
          Api()
            .subscribe(EDIT_KEY)
            .user(signoff.user)
            .get()
            .then(user => {
              this.setState(state => {
                var augmented = state;
                augmented.signoffs.push(user);
                return augmented;
              });
            });
        });
      });

    Api()
      .subscribe(EDIT_KEY)
      .publication(this.props.publicationId)
      .signoffsRemaining()
      .get()
      .then(signoffsRemaining => {
        signoffsRemaining.forEach(signoff => {
          Api()
            .subscribe(EDIT_KEY)
            .user(signoff.user)
            .get()
            .then(user => {
              this.setState(state => {
                var augmented = state;
                augmented.signoffsRemaining.push(user);
                return augmented;
              });
            });
        });
      });
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
              resource => resource.id === datum
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
              resource => resource.id === datum
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

    let signoffInvitation = null;
    if (this.state.publication.signoff_requested) {
      signoffInvitation = (
        <>
          <p>
            Signoff has been requested on this publication, and once all
            contributors have signed off, it will be published.
          </p>

          <h3>Signoffs Awaiting</h3>

          {this.state.signoffsRemaining.length ? (
            <ul>
              {this.state.signoffsRemaining.map(signoff => {
                let submitSignoffButton =
                  signoff.id === global.session.user.id ? (
                    <button
                      className="ui green button"
                      onClick={() =>
                        Api()
                          .publication(this.state.publication.id)
                          .signoffs()
                          .post({ revision: this.state.publication.revision })
                          .then()
                      }
                    >
                      Sign Off
                    </button>
                  ) : (
                    <></>
                  );
                return (
                  <li key={signoff.display_name}>
                    {signoff.display_name}
                    {submitSignoffButton}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No signoffs remain, this publication has been published!.</p>
          )}

          <h3>Signoffs Complete</h3>

          {this.state.signoffs.length ? (
            <ul>
              {this.state.signoffs.map(signoff => {
                return (
                  <li key={signoff.display_name}>{signoff.display_name}</li>
                );
              })}
            </ul>
          ) : (
            <p>No signoffs have yet been completed.</p>
          )}
        </>
      );
    } else {
      signoffInvitation = (
        <button
          className="ui green button"
          onClick={() => {
            Api()
              .publication(this.state.publication.id)
              .requestSignoff()
              .post({ revision: this.state.publication.revision })
              .then();
          }}
        >
          Finalise Publication And Request Signoffs
        </button>
      );
    }

    let addCollaboratorButton = (
      <>
        <h3>Add new Collaborator</h3>

        <div className="ui form">
          <div className="inline field">
            <label>Email Address</label>
            <input
              type="text"
              placeholder="example@example.com"
              onChange={e =>
                this.setState({
                  newCollaborator: e.target.value,
                })
              }
            />
            <button
              className="ui button"
              type="submit"
              onClick={() => {
                Api()
                  .publication(this.state.publication.id)
                  .collaborators()
                  .post({ email: this.state.newCollaborator })
                  .then();
              }}
            >
              Add New Collaborator
            </button>
          </div>
        </div>
      </>
    );

    return (
      <div>
        <div className="ui divider" />
        <main className="ui main text container">
          <article>
            <h1 className="ui header">
              <StageTitle>
                <DraftTitle>Draft </DraftTitle>
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
            <p>
              <strong>Collaborators: </strong>
              {this.state.collaborators.map(user => (
                <span key={user.id}>{user.display_name} </span>
              ))}
            </p>

            {addCollaboratorButton}

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

            {signoffInvitation}
          </article>
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

const DraftTitle = styled.span`
  color: var(--octopus-theme-draft);
`;

export default withState(EditPublicationView);
