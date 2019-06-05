import React, { Component } from "react";
import PDFImagePreviewRenderer from "./PDFImagePreviewRenderer";
import styled from "styled-components";
import Api from "../api";

class SummaryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publication: {},
      collaborators: [],
      images: undefined,
      stage: undefined,
    };

    this.fetchProblemData();
  }

  fetchProblemData() {
    Api()
      .publication(this.props.publicationId)
      .get()
      .then(publication => {
        this.setState({
          publication: publication,
          stage: this.props.stages.find(x => x.id === publication.stage),
        });
      });

    Api()
      .publication(this.props.publicationId)
      .resources()
      .get()
      .then(resources => {
        this.setState({
          images: resources,
        });
      });

    Api()
      .publication(this.props.publicationId)
      .collaborators()
      .get()
      .then(collaborators => {
        collaborators.forEach(collaborator => {
          Api()
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

  componentDidUpdate(oldProps) {
    if (oldProps.publicationId !== this.props.publicationId) {
      this.fetchProblemData();
    }

    // Make sure to update stage when our props.stages gets populated upstream
    // even if the publication id didn't change (e.g. direct navigation to page)
    // Note about duplication: the stage update in fetchProblemData is for publication state updating
    //  and the stage update here is for props updating. props.stages is never undefined, only an empty
    //  array (I hope...) so we won't need to worry about that crashing.
    // Memory reference compare; but I guess it's okay to prevent recursive updates
    if (
      oldProps.stages !== this.props.stages &&
      this.state.publication.stage !== undefined
    ) {
      this.setState({
        stage: this.props.stages.find(
          x => x.id === this.state.publication.stage,
        ),
      });
    }
  }

  render() {
    // TODO: handle cases where publication may not have loaded?

    const imagesPresent = this.state.images !== undefined;
    const stagePresent = this.state.stage !== undefined;
    const reviewPresent = this.state.publication.review;

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
            {this.state.collaborators.map(user => (
              <p key={user.id}>
                <strong>Author: </strong>
                {user.display_name}
              </p>
            ))}

            {imagesPresent && (
              <a className="ui button" href={this.state.images[0].uri}>
                <i className="ui download icon" />
                Download document
              </a>
            )}
            <section className="ui segment">
              <h3>Summary</h3>
              <div className="ui divider" />
              {this.state.publication.summary}
            </section>
            {imagesPresent ? (
              <section className="ui segment">
                <PDFImagePreviewRenderer state={this.state} />
              </section>
            ) : (
              <section className="ui placeholder segment">
                <div className="ui icon header">
                  <i className="pencil icon" />
                  No images were uploaded for this publication.
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

export default SummaryView;
