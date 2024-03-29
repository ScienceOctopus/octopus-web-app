import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Publication from "./Publication";
import PublicationModal from "./AddPublicationModal/PublicationModal";

class Stage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible = visible => () => {
    this.setState({
      modalVisible: visible,
    });
  };

  renderModal() {
    return (
      <PublicationModal
        show={this.state.modalVisible}
        onClose={this.setModalVisible(false)}
        stage={this.props.stage}
        content={this.props.content}
        backgroundColor="#FAFAFA"
      />
    );
  }

  render() {
    let {
      offset,
      height,
      margin,
      siding,
      heider,
      tainer,
    } = this.props.content.measurements;

    var active =
      this.props.stage.publications.find(
        x => x.id === this.props.content.publication,
      ) !== undefined;

    let links = null;

    if (
      this.props.stage.selection.links.length &&
      this.props.content.publication !== undefined
    ) {
      let total = height * 3 + margin * 2;

      let paths = this.props.stage.selection.links.map(([prev, next], i) => {
        let beg = (100 * ((height + margin) * prev + height / 2)) / total;
        let end = (100 * ((height + margin) * next + height / 2)) / total;

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
          <StageLinkContainer
            className={this.props.open ? "opened" : "collapsed"}
            offset={offset}
            siding={siding}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1={(100 * (offset + margin)) / (offset * 2)}
                x2="100"
                y2={(100 * (offset + margin)) / (offset * 2)}
                style={{
                  stroke: "var(--octopus-theme-publication)",
                  strokeWidth: 4,
                  fill: "transparent",
                }}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </StageLinkContainer>
          <LinksContainer
            className={this.props.open ? "opened" : "collapsed"}
            height={height}
            margin={margin}
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
        <a href={`#/stages/${this.props.stage.id}`}>
          <DotContainer>
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <Dot key={i} />
              ))}
          </DotContainer>
        </a>
      );
    }

    let publications;

    const publicationConstructor = publication => (
      <Publication
        key={publication.id}
        publication={publication}
        highlight={publication.id === this.props.content.publication}
        content={this.props.content}
        isHyperlink
        showReviews
      />
    );

    if (this.props.stage.loading) {
      publications = new Array(3)
        .fill(null)
        .map((_, i) => <Publication key={i} loading />);
    } else if (
      this.props.content.publication !== undefined &&
      !this.props.stage.selection.loading
    ) {
      publications = this.props.stage.selection.publications.map(
        publicationId => {
          let publication = this.props.stage.publications[publicationId];

          return publicationConstructor(publication);
        },
      );
    } else {
      publications = this.props.stage.publications.map(publicationConstructor);
    }

    let pubsNumber;

    if (this.props.stage.loading) {
      pubsNumber = (
        <div className={"floating ui label"}>
          <span style={{ width: "1ch", display: "inline-block" }}>
            &#x200b;
          </span>
        </div>
      );
    } else {
      pubsNumber = (
        <div
          className={
            "floating ui " + (active ? "octopus-theme accent " : "") + "label"
          }
        >
          {this.props.stage.publications.length}
        </div>
      );
    }

    let titleCard;

    if (this.props.stage.loading) {
      titleCard = (
        <h4
          style={{
            marginBottom: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <div style={{ clear: "both" }} />

          <div
            className="ui placeholder"
            style={{
              marginRight: "3.5em",
              height: "1.2em",
            }}
          >
            <div className="long line" style={{ backgroundColor: "initial" }} />
          </div>

          {pubsNumber}
        </h4>
      );
    } else {
      titleCard = (
        <h4
          style={{
            marginBottom: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <div
            className="ui icon button octopus-theme publication"
            style={{ padding: "0.5rem" }}
            onClick={this.setModalVisible(true)}
          >
            <i
              className="ui pencil alternate icon"
              style={{ color: "white" }}
            />
          </div>
          {this.props.stage.name}
          {pubsNumber}
        </h4>
      );
    }
    return (
      <div className="column" style={{ minWidth: "30ch" }}>
        <PublicationSegment
          className={
            "ui " +
            (active ? "raised " : "") +
            "segment" +
            (publications.length <= 0 ? " empty" : "")
          }
          margin={margin}
          heider={heider}
          tainer={tainer}
          onClick={event => event.stopPropagation()}
        >
          {titleCard}
          <PublicationCollapser
            className={this.props.open ? "opened" : "collapsed"}
            height={height}
            margin={margin}
          >
            <PublicationContainer height={height} margin={margin}>
              {publications}
            </PublicationContainer>
            {dots}
          </PublicationCollapser>
        </PublicationSegment>
        {links}
        {this.renderModal()}
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
  height: ${p => p.height * 3 + p.margin * 2 + "px"};
  transition: margin-top 0.3s ease-in-out, opacity 0.3s ease-in-out;

  &.opened {
    margin-top: 0;
    opacity: 1;
  }

  &.collapsed {
    margin-top: -1rem;
    opacity: 0;
  }
`;

const StyledPath = styled.path`
  stroke: var(--octopus-theme-publication);
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

const PublicationSegment = styled.div`
  &.empty {
    height: ${p => p.tainer - p.heider - p.margin * 3 + "px"};
  }
`;

const PublicationCollapser = styled.div`
  overflow: hidden;
  transition: margin-top 0.3s ease-in-out, max-height 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  height: auto;

  &.opened {
    margin-top: 1rem;
    max-height: ${p => (p.height + p.margin) * 3 + "px"};
    opacity: 1;
  }

  &.collapsed {
    margin-top: 0;
    max-height: 0;
    opacity: 0;
  }
`;

const PublicationContainer = styled.div`
  overflow-y: auto;
  max-height: ${p => p.height * 3 + p.margin * 2 + "px"};
`;

const StageLinkContainer = styled.div`
  width: calc(60px - ${p => p.siding * 2 + "px"});
  margin-left: calc(-30px + ${p => p.siding + "px"});
  height: ${p => p.offset + "px"};
  transition: opacity 0.3s ease-in-out;

  &.opened {
    opacity: 0;
  }

  &.collapsed {
    opacity: 1;
  }
`;

export default withRouter(Stage);
