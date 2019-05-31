import React, { Component } from "react";

import Publication from "./Publication";

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
          <path
            key={i}
            d={"M 0 " + beg + " C 50 " + beg + ", 50 " + end + ", 100 " + end}
            style={{ stroke: "#00726c", strokeWidth: 2, fill: "transparent" }}
            vectorEffect="non-scaling-stroke"
          />
        );
      });

      links = (
        <div
          style={{
            width: 0,
            padding: 0,
            zIndex: 999,
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <div
            style={{
              width: 60 + "px",
              height: height * 3 + "px",
              marginLeft: -30 + "px",
              marginTop: margin + "px",
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {paths}
            </svg>
          </div>
        </div>
      );
    }

    if (height !== undefined && Stage.height === undefined) {
      Stage.height = height;
    }
    if (margin !== undefined && Stage.margin === undefined) {
      Stage.margin = margin;
    }

    let style = { overflowY: "auto" };
    if (height) {
      style.maxHeight = height * 3 + "px";
    }

    let dots = null;

    if (
      this.props.content.publication !== undefined &&
      this.props.stage.publications.length > 3
    ) {
      dots = (
        <div>
          <i
            className="ui circle icon"
            style={{
              color: "#9a9a9a",
              position: "absolute",
              left: "35%",
              marginRight: 0,
              paddingBottom: 0,
              paddingTop: 0.5 + "em",
            }}
          />
          <i
            className="ui circle icon"
            style={{
              color: "#9a9a9a",
              width: "100%",
              marginRight: 0,
              paddingTop: 0.5 + "em",
            }}
          />
          <i
            className="ui circle icon"
            style={{
              color: "#9a9a9a",
              position: "absolute",
              right: "35%",
              marginRight: 0,
              paddingBottom: 0,
              paddingTop: 0.5 + "em",
            }}
          />
        </div>
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
              content={this.props.content}
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
          <div style={style}>{publications}</div>
          {dots}
        </div>
        {links}
      </div>
    );
  }
}

export default Stage;
