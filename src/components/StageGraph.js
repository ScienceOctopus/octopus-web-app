import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

import "../App.css";
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
    return (
      <Link
        to={{
          pathname: `/problems/${this.props.problem.id}`,
          state: this.props.content,
        }}
      >
        <ProblemTitleContainer>
          <div className="ui container">
            <h3 className="ui block header">
              Problem: {this.props.problem.title}
            </h3>
          </div>
        </ProblemTitleContainer>

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
              />
            ))}
          </nav>
        </GraphContainer>
      </Link>
    );
  }
}

const commonStyle = css`
  overflow-x: auto;
  overflow-y: hidden;
  margin-top: -1rem;
  background-color: #dcf8ec;
`;

const GraphContainer = styled.div`
  ${commonStyle}
  padding-top: 1em;
`;

const ProblemTitleContainer = styled.div`
  ${commonStyle}
  padding-bottom: 1.5rem;
`;

export default StageGraph;
