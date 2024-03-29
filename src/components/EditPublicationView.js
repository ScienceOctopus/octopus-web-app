import React, { Component } from "react";
import PDFImagePreviewRenderer from "./PDFImagePreviewRenderer";
import styled from "styled-components";
import Api from "../api";
import withState from "../withState";
import FileUploadSelector from "./FileUploadSelector";
import TitledForm from "./TitledForm";
import TitledCheckbox from "./TitledCheckbox";
import TagSelector from "./TagSelector";

import uniqueId from "lodash/uniqueId";
import Modal from "./Modal";
import UserSearch from "./UserSearch";

import { withRouter } from "react-router-dom";
import { RouterURI, generateLocalizedPath } from "../urls/WebsiteURIs";

const EDIT_KEY = "edit";

class EditPublicationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publication: undefined,
      collaborators: [],
      resources: undefined,
      stage: undefined,
      schema: undefined,
      signoffs: [],
      signoffsRemaining: [],
      tags: undefined,
      tagsIndex: 0,
      changed: false,
    };

    this.fetchPublicationData();
  }

  componentWillUnmount() {
    Api().unsubscribeClass(EDIT_KEY);
  }

  fetchPublicationData() {
    this.setState(
      {
        publication: undefined,
        collaborators: [],
        tags: undefined,
        changed: false,
      },
      () => {
        Api()
          .subscribeClass(EDIT_KEY, this.props.publicationId)
          .publication(this.props.publicationId)
          .get()
          .then(publication => {
            publication.data = JSON.parse(publication.data);

            this.setState(
              {
                changed: false,
                publication: publication,
              },
              () => {
                Api()
                  .subscribe(EDIT_KEY)
                  .problem(this.state.publication.problem)
                  .stage(this.state.publication.stage)
                  .get()
                  .then(stage => {
                    let schema = JSON.parse(stage.schema);
                    schema.forEach(scheme =>
                      scheme.push(uniqueId("metadata-")),
                    );
                    this.setState({
                      stage: stage,
                      schema: schema,
                    });
                  });
              },
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
            this.setState({ collaborators: [] }, () => {
              collaborators.forEach(collaborator => {
                Api()
                  .user(collaborator.user)
                  .get()
                  .then(user => {
                    this.setState(state => {
                      var augmented = state;
                      augmented.collaborators = augmented.collaborators.filter(
                        collaborator => collaborator.id !== user.id,
                      );
                      augmented.collaborators.push(user);
                      return augmented;
                    });
                  });
              });
            });
          });

        Api()
          .subscribe(EDIT_KEY)
          .publication(this.props.publicationId)
          .signoffs()
          .get()
          .then(signoffs => {
            this.setState({ signoffs: [] }, () => {
              signoffs.forEach(signoff => {
                Api()
                  .user(signoff.user)
                  .get()
                  .then(user => {
                    this.setState(state => {
                      var augmented = state;
                      augmented.signoffs = augmented.signoffs.filter(
                        signoff => signoff.id !== user.id,
                      );
                      augmented.signoffs.push(user);
                      return augmented;
                    });
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
            this.setState({ signoffsRemaining: [] }, () => {
              signoffsRemaining.forEach(signoff => {
                Api()
                  .user(signoff.user)
                  .get()
                  .then(user => {
                    this.setState(state => {
                      var augmented = state;
                      augmented.signoffsRemaining = augmented.signoffsRemaining.filter(
                        signoff => signoff.id !== user.id,
                      );
                      augmented.signoffsRemaining.push(user);
                      return augmented;
                    });
                  });
              });
            });
          });

        Api()
          .subscribe(EDIT_KEY)
          .publication(this.props.publicationId)
          .tags()
          .get()
          .then(tags => {
            tags = tags.map(tag => tag.tag);

            if (this.state.tags === undefined) {
              return this.setState({
                tags: tags,
                tagsIndex: tags.length,
              });
            }

            let newState = TagSelector.updateFromExternal(
              this.state.tags,
              this.state.tagsIndex,
              tags,
            );

            if (newState !== null) {
              this.setState({ tags: newState.tags, tagsIndex: newState.index });
            }
          });
      },
    );
  }

  componentDidUpdate(oldProps) {
    if (oldProps.publicationId !== this.props.publicationId) {
      this.fetchPublicationData();
    }
  }

  // Unused function?
  handleCollaboratorChange = e => {
    this.setState({
      newCollaborator: e.target.value,
    });
  };

  handleAddCollaborator = user => {
    Api()
      .publication(this.state.publication.id)
      .collaborators()
      .post({ userID: user.id });
  };

  handleSignoffSubmit = () => {
    Api()
      .publication(this.state.publication.id)
      .signoffs()
      .post({ revision: this.state.publication.revision })
      .then();
  };

  handleFinaliseSubmit = () => {
    Api()
      .publication(this.state.publication.id)
      .requestSignoff()
      .post({ revision: this.state.publication.revision })
      .then();
  };

  handleTitleChange = e => {
    let val = e.target.value;
    this.setState(state => {
      let publication = { ...state.publication };
      publication.title = val;
      return { publication: publication, changed: true };
    });
  };

  handleSummaryChange = e => {
    let val = e.target.value;
    this.setState(state => {
      let publication = { ...state.publication };
      publication.summary = val;
      return { publication: publication, changed: true };
    });
  };

  handleTagsChange = (tags, index) => {
    this.setState({ tags: tags, tagsIndex: index, changed: true });
  };

  handleFundingChange = e => {
    let val = e.target.value;
    this.setState(state => {
      let publication = { ...state.publication };
      publication.funding = val;
      return { publication: publication, changed: true };
    });
  };

  handleConflictChange = e => {
    let val = e.target.value;
    this.setState(state => {
      let publication = { ...state.publication };
      publication.conflict = val;
      return { publication: publication, changed: true };
    });
  };

  handleDataChange = idx => e => {
    let field = this.state.schema[idx];
    let data = [...this.state.publication.data];

    let content = e.target;

    switch (field[1]) {
      case "file":
        //content = content.files[0];
        break;
      case "uri":
        content = content.value;
        break;
      case "text":
        content = content.value;
        break;
      case "bool":
        content = content.checked;
        break;
      default:
        return;
    }

    data[idx] = content;
    this.setState(state => {
      let publication = { ...state.publication };
      publication.data = data;
      return { publication: publication, changed: true };
    });
  };

  handleEditSubmit = () => {
    let ddata = [];
    let schema = JSON.parse(this.state.stage.schema);
    schema.forEach(([key, type, title, description], i) => {
      let content = this.state.publication.data[i];

      // TODO
      /*switch (type) {
        case "file":
          data.append("file", content);
          content = fileIdx++;
          break;
        case "uri":
          break;
        case "text":
          break;
        case "bool":
          break;
        default:
          return;
      }*/

      ddata.push(content);
    });

    Api()
      .publication(this.state.publication.id)
      .post({
        id: this.state.publication.id,
        revision: this.state.publication.revision,
        title: this.state.publication.title,
        summary: this.state.publication.summary,
        tags: JSON.stringify(this.state.tags),
        funding: this.state.publication.funding,
        conflict: this.state.publication.conflict,
        data: JSON.stringify(ddata),
      })
      .then();
  };

  renderMetadata = () => {
    return (
      <>
        {this.state.schema.map(([key, type, title, description, id], i) => {
          let value = this.state.publication.data[i];
          let onChange = this.handleDataChange(i);

          switch (type) {
            case "file":
              return (
                <FileUploadSelector
                  key={key}
                  title={title}
                  description={description}
                  files={[value]}
                  onSelect={onChange}
                />
              );
            case "uri":
              return (
                <TitledForm
                  key={key}
                  title={title}
                  description={description}
                  value={value}
                  onChange={onChange}
                />
              );
            case "text":
              return (
                <TitledForm
                  key={key}
                  title={title}
                  description={description}
                  value={value}
                  onChange={onChange}
                />
              );
            case "bool":
              return (
                <TitledCheckbox
                  key={key}
                  title={title}
                  description={description}
                  checked={value}
                  onChange={onChange}
                  id={id}
                />
              );
            default:
              return null;
          }
        })}
        <div className="ui divider" />
      </>
    );
  };

  presentDeleteWarning = () => {
    return (
      <Modal>
        <div />
      </Modal>
    );
  };

  declineAuthorship = () => {
    Api()
      .publication(this.state.publication.id)
      .declineAuthorship()
      .finally(() =>
        this.props.history.replace(
          generateLocalizedPath(RouterURI.Problem, {
            id: this.props.problemId,
          }),
        ),
      );
  };

  handleDecline = () => {
    this.declineAuthorship();
  };

  renderSignoffInvitation = () => {
    if (this.state.publication.signoff_requested) {
      return (
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
                  global.session &&
                  global.session.user &&
                  signoff.id === global.session.user.id ? (
                    <>
                      {" "}
                      <button
                        className={
                          "ui green button" +
                          (this.state.changed ? " disabled" : "")
                        }
                        onClick={this.handleSignoffSubmit}
                      >
                        Sign Off
                      </button>
                    </>
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
      return (
        <>
          <button
            className={
              "ui green button" + (this.state.changed ? " disabled" : "")
            }
            onClick={this.handleFinaliseSubmit}
          >
            {this.state.collaborators.length > 1
              ? "Finalise Draft And Request Signoffs"
              : "Finalise And Publish Draft"}
          </button>
        </>
      );
    }
  };

  renderAddCollaboratorButton = () => {
    return (
      <>
        <div className="ui form">
          <UserSearch
            onSelect={this.handleAddCollaborator}
            excluded={this.state.collaborators}
          />
        </div>
      </>
    );
  };

  renderEditForm = () => {
    let metadata =
      this.state.publication !== undefined &&
      this.state.stage !== undefined &&
      this.state.resources !== undefined
        ? this.renderMetadata()
        : null;

    return (
      <>
        <div className="ui form">
          <div className="inline field">
            <label>Title</label>
            <input
              type="text"
              value={this.state.publication.title}
              onChange={this.handleTitleChange}
            />
          </div>
          <div className="ui divider" />
          <div className="field">
            <label>Summary</label>
            <textarea
              value={this.state.publication.summary}
              onChange={this.handleSummaryChange}
            />
          </div>
          <div className="field">
            <label>Keywords</label>
            {this.state.tags && (
              <TagSelector
                tags={this.state.tags}
                index={this.state.tagsIndex}
                input={true}
                onUpdate={this.handleTagsChange}
              />
            )}
          </div>
          <TitledForm
            title="Funding Statement"
            value={this.state.publication.funding}
            guidance='If this research has any funding sources you think readers should be aware of, add them here. If not, feel free to enter "None".'
            placeholder="For example, funded by the British Council"
            onChange={this.handleFundingChange}
          />
          <p />
          <TitledForm
            title="Conflict of Interest Declaration"
            value={this.state.publication.conflict}
            guidance='Declare any potential conflicts of interest this publication may have in the following box. If there aren&apos;t any, just type "No conflicts of interest".'
            placeholder="For example, no conflicts of interest"
            onChange={this.handleConflictChange}
          />
          {metadata}
          <button
            className={
              "ui button" + (!this.state.changed ? " disabled" : " green")
            }
            type="submit"
            onClick={this.handleEditSubmit}
          >
            Save Draft Changes
          </button>
        </div>
        <p>
          (Current Revision: {this.state.publication.revision}, last updated:{" "}
          {new Date(this.state.publication.updated_at).toLocaleString()})
        </p>
      </>
    );
  };

  render() {
    // TODO: handle cases where publication may not have loaded?
    if (this.state.publication === undefined) {
      return null;
    }

    const mainResourcePresent =
      this.state.resources !== undefined && this.state.resources.length > 0;
    const stagePresent = this.state.stage !== undefined;
    const reviewPresent = this.state.publication.review;

    let signoffInvitation =
      this.state.publication !== {} ? this.renderSignoffInvitation() : null;

    let editForm = this.renderEditForm();

    return (
      <div>
        <div className="ui divider" />
        <main className="ui main container">
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
            <h3>Collaborators</h3>
            <ul>
              {this.state.collaborators.map(user => (
                <li key={user.id}>{user.display_name}</li>
              ))}
            </ul>

            {/* <div className="ui divider" /> */}
            <h4>{"Add new"}</h4>
            {this.renderAddCollaboratorButton()}

            <div className="ui divider" />

            {mainResourcePresent && (
              <a className="ui button" href={this.state.resources[0].uri}>
                <i className="ui download icon" />
                Download document
              </a>
            )}

            <div className="ui divider" />

            {editForm}

            <div className="ui divider" />

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

            <div className="ui divider" />

            {signoffInvitation}

            <button className="ui red button" onClick={this.handleDecline}>
              {this.state.collaborators.length > 1
                ? "Decline Authorship"
                : "Delete Draft"}
            </button>
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

export default withRouter(withState(EditPublicationView));
