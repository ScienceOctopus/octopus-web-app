import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import styled from "styled-components";

import Review from "./Review";

class Publication extends Component {
  render() {
    let onClick =
      this.props.onClick ||
      (event => {
        this.props.history.push(
          `/publications/${this.props.publication.id}`,
          this.props.content,
        );
        event.stopPropagation();
      });

    let publicationView;

    if (this.props.loading) {
      publicationView = (
        <BgDiv
          className="ui segment"
          highlight={false}
          review={false}
          pointer={false}
        >
          <div className="ui placeholder">
            <h5 style={{ marginBottom: 0 }}>
              <span style={{ float: "left" }}>&#x200b;</span>
              <div className="header" style={{ fontSize: 0 }} />
              <div style={{ clear: "both" }} />
            </h5>
            <div style={{ height: "1rem", backgroundColor: "#fff" }} />
            <div className="meta">
              <span style={{ float: "left" }}>&#x200b;</span>
              <div
                className="full line"
                style={{
                  backgroundColor: "initial",
                  marginTop: 0,
                  marginBottom: 0,
                }}
              />
              <div style={{ clear: "both" }} />
            </div>
            <div
              className="description"
              style={{
                height: "3rem",
                lineHeight: "1.2rem",
                overflow: "hidden",
              }}
            >
              <div
                className="full line"
                style={{ backgroundColor: "initial" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  height: "0.6rem",
                  background:
                    "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                }}
              />
            </div>
          </div>
        </BgDiv>
      );
    } else if (
      this.props.highlight &&
      this.props.showReviews &&
      this.props.publication.reviews !== undefined
    ) {
      let { height, margin, heider } = this.props.content.measurements;

      let reviews = null;

      if (this.props.publication.reviews.length > 0) {
        reviews = this.props.publication.reviews.map(review => (
          <Review
            key={review.id}
            review={review}
            content={this.props.content}
            highlight={review.id === this.props.content.review}
            isHyperlink
          />
        ));

        reviews = (
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
        );
      }

      reviews = (
        <div>
          <div style={{ height: "3rem", position: "relative" }}>
            <h4 style={{ fontSize: "1rem", position: "absolute", bottom: 0 }}>
              <i
                onClick={event => {
                  this.props.history.push(
                    `/publish/problems/${
                      this.props.publication.problem
                    }/stages/${this.props.publication.stage}/review/${
                      this.props.publication.id
                    }`,
                  );
                  event.stopPropagation();
                }}
                className="ui pencil alternate icon"
                style={{
                  marginRight: "0.5em",
                  color: "gray",
                  cursor: "pointer",
                }}
              />
              {reviews === null ? "No" : this.props.publication.reviews.length}{" "}
              Review{this.props.publication.reviews.length != 1 ? "s" : ""}
            </h4>
          </div>
          {reviews}
        </div>
      );

      publicationView = (
        <BgDiv
          className="ui segment"
          onClick={onClick}
          review={this.props.content.review !== undefined}
          {...this.props}
        >
          <Title>{this.props.publication.title}</Title>
          <div className="meta">
            {new Date(this.props.publication.created_at).toLocaleDateString()}
          </div>
          {reviews}
        </BgDiv>
      );
    } else {
      publicationView = (
        <BgDiv
          className="ui segment"
          onClick={onClick}
          highlight={this.props.highlight}
          review={this.props.review}
          pointer={this.props.pointer}
        >
          <Title>{this.props.publication.title}</Title>
          <div className="meta">
            {new Date(this.props.publication.created_at).toLocaleDateString()}
          </div>
          <Summary className="description" highlight={this.props.highlight}>
            {this.props.publication.summary}
          </Summary>
        </BgDiv>
      );
    }

    return publicationView;
  }
}

const BgDiv = styled.div`
  &.segment {
    background-color: ${props => (props.highlight ? "#99ffd3" : "white")};
    cursor: ${props =>
      (props.highlight && !props.review && !props.pointer) ||
      props.pointer === false
        ? "default"
        : "pointer"};

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

const Summary = styled.div`
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
