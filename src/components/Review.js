import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

class Review extends Component {
  render() {
    return (
      <BgDiv
        className="ui segment"
        {...this.props}
        onClick={event => {
          this.props.history.push(
            `/publications/${this.props.review.id}`,
            this.props.content,
          );
          event.stopPropagation();
        }}
      >
        <Title>{this.props.review.title}</Title>
        <div className="meta">{this.props.review.created_at}</div>
        <Description className="description" highlight={this.props.highlight}>
          {this.props.review.description}
        </Description>
      </BgDiv>
    );
  }
}

const BgDiv = styled.div`
  &.segment {
    background-color: ${props => (props.highlight ? "#ffe499" : "white")};
    cursor: ${props => (props.highlight ? "default" : "pointer")};

    padding: 1em 1em;
    border-radius: 0.25rem;
    border: 1px solid rgba(34, 36, 38, 0.15);
    font-size: 0.75rem;
    padding-bottom: 0;
    margin-bottom: 1rem;
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
          props.highlight ? "rgba(255, 228, 153, 0)" : "rgba(255, 255, 255, 0)"}
        0%,
      ${props =>
          props.highlight ? "rgba(255, 228, 153, 1)" : "rgba(255, 255, 255, 1)"}
        100%
    );
  }
`;

export default withRouter(Review);
