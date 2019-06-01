import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

class Publication extends Component {
  render() {
    let publicationView = (
      <BgDiv
        className="ui segment"
        onClick={this.props.onClick}
        style={{ marginBottom: "1rem" }}
        {...this.props}
      >
        <Title>{this.props.publication.title}</Title>
        <div className="meta">{this.props.publication.created_at}</div>
        <Description className="description" {...this.props}>
          {this.props.publication.description}
        </Description>
      </BgDiv>
    );

    return this.props.isHyperlink
      ? this.linkToPublication(publicationView)
      : publicationView;
  }

  linkToPublication = Child => {
    return (
      <Link
        to={{
          pathname: `/publications/${this.props.publication.id}`,
          state: this.props.content,
        }}
      >
        {Child}
      </Link>
    );
  };
}

const BgDiv = styled.div`
  &.segment {
    background-color: ${props => (props.highlight ? "#9fffd6" : "white")};

    padding: 1em 1em;
    border-radius: 0.25rem;
    border: 1px solid rgba(34, 36, 38, 0.15);
    font-size: 0.75rem;
    padding-bottom: 0;
    margin-bottom: 0.5em;
  }
`;

const Title = styled.h5`
  white-space: nowrap;
  text-overflow: hidden;
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

export default Publication;
