import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { generateLocalizedPath, RouterURI } from "../urls/WebsiteURIs";

class Review extends Component {
  render() {
    return (
      <BgDiv
        className={
          "ui segment octopus-theme review" +
          (this.props.highlight ? " inverted highlight" : "")
        }
        highlight={this.props.highlight}
        onClick={event => {
          this.props.history.push(
            generateLocalizedPath(RouterURI.Publication, {
              id: this.props.review.id,
            }),
            this.props.content,
          );
          event.stopPropagation();
        }}
      >
        <Title>{this.props.review.title}</Title>
        <div className="meta">
          {new Date(this.props.review.created_at).toLocaleDateString()}
        </div>
        <Summary className="description" highlight={this.props.highlight}>
          {this.props.review.summary}
        </Summary>
      </BgDiv>
    );
  }
}

const BgDiv = styled.div`
  &&&& {
    cursor: ${props => (props.highlight ? "default" : "pointer")};

    padding: 1em 1em;
    border-radius: 0.25rem;
    border: 1px solid rgba(34, 36, 38, 0.15);
    font-size: 0.75rem;
    padding-bottom: 0;
    margin-bottom: 1rem;
  }

  &&&:last-child {
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
          props.highlight
            ? "var(--octopus-theme-review-highlight-transparent)"
            : "rgba(255, 255, 255, 0)"}
        0%,
      ${props =>
          props.highlight
            ? "var(--octopus-theme-review-highlight)"
            : "rgba(255, 255, 255, 1)"}
        100%
    );
  }
`;

export default withRouter(Review);
