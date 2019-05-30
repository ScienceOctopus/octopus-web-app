import React, { Component } from "react";

import Publication from "./Publication";

class Stage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: undefined,
    };
  }

  callback(me, ref) {
    if (ref && ref !== me.state.ref) {
      me.setState({ ref: ref });
    }
  }

  render() {
    var active = false; //this.state.activeStage === this.state.stage.id;

    let links = null;

    if (this.props.stage.links.length && this.state.ref) {
      let cntBB = this.state.ref.getBoundingClientRect();
      let pubBB = this.state.ref.firstChild.children[1].getBoundingClientRect();

      let height = pubBB.bottom - pubBB.top;
      let margin = pubBB.top - cntBB.top;

      let paths = this.props.stage.links.map(([prev, next]) => {
        let beg =
          (prev * 100) / this.props.stage.linkSize +
          50 / this.props.stage.linkSize;
        let end =
          (next * 100) / this.props.stage.linkSize +
          50 / this.props.stage.linkSize;

        // console.log(prev, next, beg, end);

        return (
          <path
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
              height: height * this.props.stage.linkSize + "px",
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

    return (
      <div class="column" ref={ref => this.callback(this, ref)}>
        <div className={"ui " + (active ? "raised " : "") + "segment"}>
          <h4>
            {this.props.stage.name}
            <div className={"floating ui " + (active ? "teal " : "") + "label"}>
              {this.props.stage.publications.length}
            </div>
          </h4>
          {this.props.stage.publications.map(publication => (
            <Publication publication={publication} />
          ))}
        </div>
        {links}
      </div>
    );
  }
}

export default Stage;
