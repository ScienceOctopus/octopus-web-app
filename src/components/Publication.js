import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

class Publication extends Component {
  render() {
    let publicationView = (
      <BgDiv
        className="ui segment"
        onClick={this.props.onClick}
        {...this.props}
      >
        <Title>{this.props.publication.title}</Title>
        <div className="meta">{this.props.publication.created_at}</div>
        <div className="description fade">
          {this.props.publication.description}
        </div>
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
  &&&&.segment {
    background-color: ${props => (props.highlight ? "green" : "white")};
  }
  cursor: ${p => (p.onClick !== undefined ? "pointer" : "-")};

  padding: 1em 1em;
  border-radius: 0.25rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  font-size: 0.75 + "rem";
  padding-bottom: 0;
  margin-bottom: 0.5 + "em";
`;

const Title = styled.h5`
  white-space: nowrap;
  text-overflow: hidden;
  overflow: hidden;
  width: 100%;
`;

export default Publication;
