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
  constructor(props) {
    super(props);
    this.state = {
      problem: props.problemId,
      content: {},
      stages: [],
    };

    fetch(`/api/problems/${this.state.problem}`)
      .then(response => response.json())
      .then(content => {
        console.log(content);
        this.setState({ content: content });
      });

    fetch(`/api/problems/${this.state.problem}/stages`)
      .then(response => response.json())
      .then(stages => {
        stages.sort((a, b) => a.id - b.id);
        this.setState({ stages: stages });
      });
  }

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
              Problem: {this.state.content.title}
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
              "ui " + numbers[this.state.stages.length] + " column grid"
            }
            style={{ minWidth: 80 + "em", margin: 0 }}
          >
            {this.state.stages.map(stage => (
              <Stage problemId={this.state.problem} stage={stage} />
            ))}
          </nav>
        </div>
      </div>
    );
  }
}

export default StageGraph;
