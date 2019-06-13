import React, { Component } from "react";
import PDFImagePreviewRenderer from "./PDFImagePreviewRenderer";
import styled from "styled-components";
import Api from "../api";

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
    };

    this.fetchPublicationData();
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
                }),
              );
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
        collaborators.forEach(collaborator => {
          Api()
            .subscribe(EDIT_KEY)
            .user(collaborator.user)
            .get()
            .then(user => {
              this.setState(state => {
                var augmented = state;
                augmented.collaborators.push(user);
                return augmented;
              });
            });
        });
      });
  }

  componentWillUnmount() {
    Api().unsubscribeClass(EDIT_KEY);
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
                <input type="checkbox" checked={datum} disabled />
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
              <strong>DRAFT PUBLICATION!!! Date added: </strong>
              {new Date(this.state.publication.created_at).toLocaleDateString()}
            </p>
            {this.state.collaborators.map(user => (
              <p key={user.id}>
                <strong>Author: </strong>
                {user.display_name}
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
          </article>
        </main>
      </div>
    );
  }
}

const StageTitle = styled.span`
  color: #00b5ad;
`;

const ReviewTitle = styled.span`
  color: #9eb300;
`;

export default EditPublicationView;
