import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

class Publication extends Component {
  render() {
    let publicationView = (
      <BgDiv
        className="ui segment"
        onClick={this.props.onClick}
        {...this.props}
      >
        <h5
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {this.props.publication.title}
        </h5>
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

export default Publication;
