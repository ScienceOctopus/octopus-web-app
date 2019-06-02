import React, { Component } from "react";
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
  }

  componentDidUpdate(oldProps) {
    if (oldProps.publicationId !== this.props.publicationId) {
      this.fetchProblemData();
    }
  }

  render() {
    return (
      <div>
        <div className="ui divider" />
        <main className="ui main container">
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
            <section className="ui segment">
              <h3>Summary</h3>
              <div className="ui divider" />
              {this.state.publication.description}
            </section>
            <section className="ui segment">
              <h3>Document</h3>
              <object
                width="500"
                height="500"
                type="application/pdf"
                data="https://arxiv.org/ftp/arxiv/papers/1905/1905.12599.pdf"
              >
                <p>Embedding failure</p>
              </object>
            </section>
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
