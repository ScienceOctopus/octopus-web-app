import React, { Component } from "react";

import Publication from "./Publication";
import styled from "styled-components";

class Stage extends Component {
  static height = undefined;
  static margin = undefined;

  constructor(props) {
    super(props);
    this.state = {
      ref: undefined,
    };
  }

  refCallback(me, ref) {
    if (ref && ref !== me.state.ref) {
      me.setState({ ref: ref });
    }
  }

  render() {
    var active =
      this.props.stage.publications.find(
        x => x.id === this.props.content.publication,
      ) !== undefined;

    let links = null;

    let height = Stage.height;
    let margin = Stage.margin;

    if (
      this.props.stage.publications.length &&
      this.state.ref &&
      this.state.ref.firstChild.children[1].firstChild
    ) {
      let cntBB = this.state.ref.getBoundingClientRect();
      let pubBB = this.state.ref.firstChild.children[1].firstChild.getBoundingClientRect();

      height = pubBB.bottom - pubBB.top;
      margin = pubBB.top - cntBB.top;
    }

    if (
      this.props.stage.links.length &&
      this.props.content.publication !== undefined
    ) {
      let paths = this.props.stage.selection.links.map(([prev, next], i) => {
        let beg = (prev * 100) / 3 + 50 / 3;
        let end = (next * 100) / 3 + 50 / 3;

        return (
          <StyledPath
            key={i}
            d={"M 0 " + beg + " C 50 " + beg + ", 50 " + end + ", 100 " + end}
            vectorEffect="non-scaling-stroke"
          />
        );
      });

      links = (
        <LinksContainer>
          <SingleLink height={height} margin={margin}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {paths}
            </svg>
          </SingleLink>
        </LinksContainer>
      );
    }

    if (height !== undefined && Stage.height === undefined) {
      Stage.height = height;
    }
    if (margin !== undefined && Stage.margin === undefined) {
      Stage.margin = margin;
    }

    let dots = null;

    if (
      this.props.content.publication !== undefined &&
      this.props.stage.publications.length > 3
    ) {
      dots = <DotContainer>{Array(3).fill(<Dot />)}</DotContainer>;
    }

    let publications;

    if (this.props.content.publication !== undefined) {
      publications = this.props.stage.selection.publications.map(
        publicationId => {
          let publication = this.props.stage.publications[publicationId];

          return (
            <Publication
              key={publication.id}
              publication={publication}
              highlight={publication.id === this.props.content.publication}
              content={this.props.content}
              isHyperlink
            />
          );
        },
      );
    } else {
      publications = this.props.stage.publications.map(publication => (
        <Publication
          key={publication.id}
          publication={publication}
          content={this.props.content}
          highlight={publication.id === this.props.content.publication}
          isHyperlink
        />
      ));
    }

    return (
      <div className="column" ref={ref => this.refCallback(this, ref)}>
        <div className={"ui " + (active ? "raised " : "") + "segment"}>
          <h4>
            {this.props.stage.name}
            <div className={"floating ui " + (active ? "teal " : "") + "label"}>
              {this.props.stage.publications.length}
            </div>
          </h4>
          <PublicationContainer>{publications}</PublicationContainer>
          {dots}
        </div>
        {links}
      </div>
    );
  }
}

const LinksContainer = styled.div`
  width: 0;
  padding: 0;
  z-index: 999;
  position: absolute;
  top: 0;
  right: 0;
`;

const SingleLink = styled.div`
  width: 60px;
  margin-left: -30px;
  margin-top: ${p => p.margin + "px"};
  height: ${p => p.height * 3 + "px"};
`;

const StyledPath = styled.path`
  stroke: #00726c;
  stroke-width: 2;
  fill: transparent;
`;

const Dot = styled.div`
  width: 1em;
  height: 1em;
  border-radius: 50%;
  display: inline-block;
  background-color: #9a9a9a;
  margin: 0.2em;
`;

const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.4em;
`;

const PublicationContainer = styled.div`
  overflow-y: auto;
  max-height: ${p => (p.height ? p.height * 3 + "px" : "")};
`;

export default Stage;
