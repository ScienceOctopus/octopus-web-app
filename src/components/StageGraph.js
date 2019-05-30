import React, { Component } from "react";
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
      <div>
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            marginTop: -1 + "rem",
            paddingBottom: 1.5 + "rem",
            backgroundColor: "#dcf8ec",
          }}
        >
          <div className="ui container" style={{ marginTop: 1 + "em" }}>
            <h3 className="ui block header">
              Problem: {this.props.problem.title}
            </h3>
          </div>
        </div>
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            marginTop: -1 + "rem",
            backgroundColor: "#dcf8ec",
          }}
        >
          <nav
            className={
              "ui " + numbers[this.props.stages.length] + " column grid"
            }
            style={{ minWidth: 80 + "em", margin: 0 }}
          >
            {this.props.stages.map((stage, stageId) => (
              <Stage stage={stage} content={this.props.content} />
            ))}
          </nav>
        </div>
      </div>
    );
  }
}

export default StageGraph;
