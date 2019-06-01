import React, { Component } from "react";

import Publication from "./Publication";
import styled from "styled-components";

class Stage extends Component {
  static height = undefined;
  static margin = undefined;
  static between = undefined;

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
    let between = Stage.between;

    if (
      this.props.stage.publications.length &&
      this.state.ref &&
      this.state.ref.firstChild.children[1].firstChild.firstChild
    ) {
      let cntBB = this.state.ref.getBoundingClientRect();
      let pubBB = this.state.ref.firstChild.children[1].firstChild.firstChild.getBoundingClientRect();

      height = pubBB.bottom - pubBB.top;
      margin = pubBB.top - cntBB.top;

      if (this.state.ref.firstChild.children[1].firstChild.children[1]) {
        let sndBB = this.state.ref.firstChild.children[1].firstChild.children[1].getBoundingClientRect();

        between = sndBB.top - pubBB.bottom;
      }
    }

    if (height !== undefined && Stage.height === undefined) {
      Stage.height = height;
    }
    if (margin !== undefined) {
      if (Stage.margin === undefined) {
        Stage.margin = margin;
      } else {
        Stage.margin = margin = Math.max(Stage.margin, margin);
      }
    }
    if (between !== undefined && Stage.between === undefined) {
      Stage.between = between;
    }

    if (
      this.props.stage.links.length &&
      this.props.content.publication !== undefined &&
      height !== undefined &&
      margin !== undefined &&
      (between !== undefined || this.props.selection.publications.length < 2)
    ) {
      let between = Stage.between || 0;
      let total = height * 3 + between * 2;

      console.log(height, between, total);

      let paths = this.props.stage.selection.links.map(([prev, next], i) => {
        let beg = (100 * ((height + between) * prev + height / 2)) / total;
        let end = (100 * ((height + between) * next + height / 2)) / total;

        return (
          <StyledPath
            key={i}
            d={"M 0 " + beg + " C 50 " + beg + ", 50 " + end + ", 100 " + end}
            vectorEffect="non-scaling-stroke"
          />
        );
      });

      links = (
        <LinksColumn>
          <LinksContainer
            className={this.props.open ? "opened" : "collapsed"}
            height={height}
            margin={margin}
            between={between}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {paths}
            </svg>
          </LinksContainer>
        </LinksColumn>
      );
    }

    let dots = null;

    if (
      this.props.content.publication !== undefined &&
      this.props.stage.selection.size > 3
    ) {
      dots = (
        <DotContainer>
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Dot key={i} />
            ))}
        </DotContainer>
      );
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
      <div
        className="column"
        ref={ref => this.refCallback(this, ref)}
        style={{ backgroundColor: "#dcf8ec" }}
      >
        <div className={"ui " + (active ? "raised " : "") + "segment"}>
          <h4 style={{ marginBottom: 0 }}>
            {this.props.stage.name}
            <div className={"floating ui " + (active ? "teal " : "") + "label"}>
              {this.props.stage.publications.length}
            </div>
          </h4>
          <div
            className={"stage " + (this.props.open ? "opened" : "collapsed")}
            style={{
              overflow: "hidden",
              transition:
                "margin-top 0.3s ease-in-out, margin-bottom 0.3s ease-in-out, max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              height: "auto",
            }}
          >
            <PublicationContainer height={height} between={between}>
              {publications}
            </PublicationContainer>
            {dots}
          </div>
        </div>
        {links}
      </div>
    );
  }
}

const LinksColumn = styled.div`
  width: 0;
  padding: 0;
  z-index: 999;
  position: absolute;
  top: 0;
  right: 0;
`;

const LinksContainer = styled.div`
  width: 60px;
  margin-left: -30px;
  height: ${p => p.height * 3 + p.between * 2 + "px"};
  transition: margin-top 0.3s ease-in-out, opacity 0.3s ease-in-out;

  &.opened {
    margin-top: ${p => (p.margin ? p.margin + "px" : "")};
    opacity: 1;
  }

  &.collapsed {
    margin-top: calc(${p => (p.margin ? p.margin + "px" : "")} - 1rem);
    opacity: 0;
  }
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
  position: absolute;
  display: flex;
  justify-content: center;
  margin-top: calc(-0.5rem - 0.2em);
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
`;

const PublicationContainer = styled.div`
  overflow-y: auto;
  max-height: ${p =>
    p.height
      ? "calc(" +
        (p.height * 3 + (p.between ? p.between * 2 : 0) + "px") +
        " + 1rem)"
      : ""};
`;

export default Stage;
