import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import Stage from "./Stage";

const numbers = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
];

class StageGraph extends Component {
  render() {
    const open = this.props.open;

    let problem = this.props.problem.title || (
      <div>
        <div
          className="ui fluid placeholder"
          style={{ marginTop: "0.05em", height: "1.28571429rem" }}
        >
          <div
            className="line"
            style={{ backgroundColor: "initial", marginBottom: 0 }}
          />
        </div>
      </div>
    );

    let stages;
    const stagesLoaded = this.props.stages.length > 0;

    if (stagesLoaded) {
      stages = this.props.stages.map(stage => (
        <Stage
          key={stage.id}
          stage={stage}
          content={this.props.content}
          open={open}
        />
      ));
    } else {
      stages = new Array(6).fill(null).map((_, i) => (
        <Stage
          key={i}
          stage={{
            name: undefined,
            publications: [],
            links: [],
            selection: {
              publications: [],
              links: [],
            },
            loading: true,
          }}
          content={this.props.content}
          open={open}
        />
      ));
    }

    const stagesLength = stagesLoaded ? this.props.stages.length : 6;
    return (
      <div
        onClick={event => {
          if (this.props.problem.id !== undefined) {
            this.props.history.push(
              `/problems/${this.props.problem.id}`,
              this.props.content,
            );
          }
          event.stopPropagation();
        }}
        className="ui one column grid"
        style={{ backgroundColor: "#dcf8ec" }}
      >
        <div className="column">
          <div className="ui container">
            <h3
              className="ui block header"
              style={{
                cursor:
                  this.props.content.publication !== undefined
                    ? "pointer"
                    : "default",
              }}
            >
              <span style={{ marginRight: "0.5em", float: "left" }}>
                Problem:
              </span>
              {problem}
            </h3>
          </div>
        </div>

        <div className="column">
          <div
            className={"ui " + numbers[stagesLength] + " column grid"}
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              flexWrap: "nowrap",
              padding: "0 1em",
            }}
          >
            <div
              className="column"
              style={{
                width: "5.4em",
              }}
            >
              <div
                className="ui segment inverted teal"
                onClick={event => {
                  this.props.toggleOpen();
                  event.stopPropagation();
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <GraphHider className={(open ? "minus " : "plus") + " icon"} />
              </div>
            </div>

            {stages}
          </div>
        </div>
      </div>
    );
  }
}

const GraphHider = styled.i`
  fontsize: 1.07142857rem;
  color: #fff;
  /*transition: transform 0.3s ease-in-out;

  &.opened {
    transform: rotate(180deg) translateY(-5px);
  }

  &.collapsed {
    transform: rotate(0deg) translateY(-5px);
  }*/
`;

export default withRouter(StageGraph);
