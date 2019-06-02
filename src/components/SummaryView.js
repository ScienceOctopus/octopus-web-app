import React, { Component } from "react";
import PDFImagePreviewRenderer from './PDFImagePreviewRenderer';
import styled from "styled-components";

class SummaryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publication: {},
    };

    this.fetchProblemData();
  }

  fetchProblemData() {
    fetch(`/api/publications/${this.props.publicationId}`)
      .then(response => response.json())
      .then(publication => {
        this.setState({ publication: publication });
      });
    fetch(`/api/publications/${this.props.publicationId}/resources`)
      .then(response => response.json())
      .then(resources => {
        this.setState({ publication: { images: resources } });
      });
  }

  componentDidUpdate(oldProps) {
    if (oldProps.publicationId !== this.props.publicationId) {
      this.fetchProblemData();
    }
  }

  render() {
    const imagesPresent = (this.state.publication.images !== undefined);

    return (
      <div>
        <div className="ui divider" />
        <main className="ui main text container">
          <article>
            <h1 className="ui header">
              <StageTitle>
                Hypothesis
                <ReviewTitle>
                  {this.state.publication.review ? " Review" : ""}
                </ReviewTitle>
                :{" "}
              </StageTitle>
              {this.state.publication.title}
              <div className="ui sub header">
                {this.state.publication.summary}
              </div>
            </h1>
            <p>
              <strong>Date added: </strong>
              {new Date(this.state.publication.created_at).toLocaleDateString()}
            </p>
	    { imagesPresent && <a className="ui button" href={this.state.publication.images[0].uri}>
		<i className="ui download icon"></i>Download document
	    </a> }
            <section className="ui segment">
              <h3>Summary</h3>
              <div className="ui divider" />
              {this.state.publication.description}
            </section>
            { imagesPresent ?
	      <section className="ui segment">
                <PDFImagePreviewRenderer state={ this.state } />
              </section>
	    :
              <section className="ui placeholder segment">
                <div className="ui icon header">
		  <i className="pencil icon"></i>
		  No images were uploaded for this publication.
		</div>
	      </section>
            }
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
