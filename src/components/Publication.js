import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import Review from "./Review";

class Publication extends Component {
  render() {
    let onClick =
      this.props.onClick ||
      (() =>
        this.props.history.replace(
          `/publications/${this.props.publication.id}`,
          this.props.content,
        ));

    let publicationView;

    if (
      this.props.highlight &&
      this.props.showReviews &&
      this.props.publication.reviews !== undefined &&
      this.props.publication.reviews.length > 0
    ) {
      let { height, margin, heider } = this.props.content.measurements;
      let reviews = this.props.publication.reviews.map(review => (
        <Review
          key={review.id}
          review={review}
          content={this.props.content}
          highlight={false}
          isHyperlink
        />
      ));

      reviews = (
        <div>
          <div style={{ height: "3rem", position: "relative" }}>
            <h4 style={{ fontSize: "1rem", position: "absolute", bottom: 0 }}>
              Reviews
            </h4>
          </div>
          <div
            style={{
              overflowY: "auto",
              maxHeight: "calc(" + (heider - height - margin) + "px - 1em)",
              marginTop: "1rem",
              marginBottom: "1em",
            }}
          >
            {reviews}
          </div>
        </div>
      );

      publicationView = (
        <BgDiv className="ui segment" onClick={onClick} {...this.props}>
          <Title>{this.props.publication.title}</Title>
          <div className="meta">{this.props.publication.created_at}</div>
          {reviews}
        </BgDiv>
      );
    } else {
      publicationView = (
        <BgDiv className="ui segment" onClick={onClick} {...this.props}>
          <Title>{this.props.publication.title}</Title>
          <div className="meta">{this.props.publication.created_at}</div>
          <Description className="description" {...this.props}>
            {this.props.publication.description}
          </Description>
        </BgDiv>
      );
    }

    return publicationView;
  }
}

const BgDiv = styled.div`
  &.segment {
    background-color: ${props => (props.highlight ? "#9fffd6" : "white")};

    padding: 1em 1em;
    border-radius: 0.25rem;
    border: 1px solid rgba(34, 36, 38, 0.15);
    font-size: 0.75rem;
    padding-bottom: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.h5`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`;

const Description = styled.div`
  &.description {
    position: relative;
    height: 3rem;
    line-height: 1.2rem;
    overflow: hidden;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 0.6rem;
    background: linear-gradient(
      to bottom,
      ${props =>
          props.highlight ? "rgba(159, 255, 214, 0)" : "rgba(255, 255, 255, 0)"}
        0%,
      ${props =>
          props.highlight ? "rgba(159, 255, 214, 1)" : "rgba(255, 255, 255, 1)"}
        100%
    );
  }
`;

export default withRouter(Publication);
