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
    this._children = [];

    fetch(`/api/problems/${this.state.problem}`)
      .then(response => response.json())
      .then(content => this.setState({ content: content }));

    fetch(`/api/problems/${this.state.problem}/stages`)
      .then(response => response.json())
      .then(stages => {
        stages.sort((a, b) => a.id - b.id);
        this.componentDidUpdate = this.stagesDidLoad;
        this.setState({ stages: stages });
      });
  }

  stagesDidLoad() {
    this.componentDidUpdate = undefined;

    for (let i = 0; i < this._children.length; i++) {
      this._children[i].setNext(this._children[i + 1]);
    }
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
            {
              this.state.stages.reduce(
                ([acc, i], stage) => {
                  acc.push(
                    <Stage
                      problemId={this.state.problem}
                      stage={stage}
                      ref={child => (this._children[i] = child)}
                    />
                  );
                  return [acc, i + 1];
                },
                [[], 0]
              )[0]
            }
          </nav>
        </div>
      </div>
    );
  }
}

export default StageGraph;
