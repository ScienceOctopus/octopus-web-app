import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import { generateLocalizedPath, RouterURI } from "../urls/WebsiteURIs";
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
          &#x200b;
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

    const { tainer, heider, margin } = this.props.content.measurements;

    const stagesLength = stagesLoaded ? this.props.stages.length : 6;
    return (
      <div
        onClick={event => {
          if (this.props.problem.id !== undefined) {
            this.props.history.push(
              generateLocalizedPath(RouterURI.Problem, {
                id: this.props.problem.id,
              }),
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
                minHeight: "calc(1.28571429em + 2 * (0.785714rem + 1px))",
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
            id="octopus-flow-graph"
          >
            <div
              className="column"
              style={{
                width: "5.4em",
              }}
            >
              <GraphButton
                className="ui icon button teal"
                onClick={event => {
                  this.props.toggleOpen();
                  event.stopPropagation();
                }}
                tainer={tainer}
                heider={heider}
                margin={margin}
              >
                <GraphMiddler>
                  <GraphHider
                    className={(open ? "minus " : "plus") + " icon"}
                  />
                </GraphMiddler>
              </GraphButton>
            </div>

            {stages}
          </div>
        </div>
      </div>
    );
  }
}

const GraphButton = styled.div`
  width: ${p => p.tainer - p.heider - p.margin * 3 + "px"};
  height: ${p => p.tainer - p.heider - p.margin * 3 + "px"};
  position: relative;
`;

const GraphMiddler = styled.div`
  margin: auto !important;
  position: absolute;
  width: 1rem;
  height: 1rem;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const GraphHider = styled.i`
  font-size: 1rem;
  color: #fff;
`;

export default withRouter(StageGraph);
