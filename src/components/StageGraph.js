import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled, { css } from "styled-components";

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

    return (
      <div
        onClick={event => {
          if (
            window.getComputedStyle(event.target).backgroundColor ===
            "rgb(220, 248, 236)"
          ) {
            this.props.history.replace(
              `/problems/${this.props.problem.id}`,
              this.props.content,
            );
          }
        }}
      >
        <ProblemTitleContainer>
          <div className="ui container">
            <h3 className="ui block header">
              Problem: {this.props.problem.title}
            </h3>
          </div>
        </ProblemTitleContainer>

        <div style={{ backgroundColor: "#dcf8ec" }}>
          <div
            className="ui segment"
            onClick={() => this.props.toggleOpen()}
            style={{ float: "left", margin: "1em 30px 0 30px" }}
          >
            <i
              className={
                "chevron down icon heider " + (open ? "opened" : "collapsed")
              }
              style={{
                fontSize: 1.07142857 + "rem",
                color: "#4b72ab",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </div>

          <GraphContainer>
            <nav
              className={
                "ui " + numbers[this.props.stages.length] + " column grid"
              }
            >
              {this.props.stages.map(stage => (
                <Stage
                  key={stage.id}
                  stage={stage}
                  content={this.props.content}
                  open={open}
                />
              ))}
            </nav>
          </GraphContainer>
        </div>
      </div>
    );
  }
}

const commonStyle = css`
  background-color: #dcf8ec;
  overflow-x: auto;
  overflow-y: hidden;
  margin-top: -1rem;
`;

const GraphContainer = styled.div`
  ${commonStyle}
  padding-top: 1em;
  padding-right: 30px;
  padding-bottom: 30px;
`;

const ProblemTitleContainer = styled.div`
  ${commonStyle}
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
`;

export default withRouter(StageGraph);
