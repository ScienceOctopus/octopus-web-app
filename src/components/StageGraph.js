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
        <div style={{ clear: "both" }} />
      </div>
    );

    let stages;

    if (this.props.stages.length > 0) {
      stages = (
        <div
          className={"ui " + numbers[this.props.stages.length] + " column grid"}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            flexWrap: "nowrap",
          }}
        >
          {this.props.stages.map(stage => (
            <Stage
              key={stage.id}
              stage={stage}
              content={this.props.content}
              open={open}
            />
          ))}
        </div>
      );
    } else {
      stages = (
        <div
          className="ui six column grid"
          style={{ overflowX: "auto", overflowY: "hidden", flexWrap: "nowrap" }}
        >
          <div
            className="column"
            style={{ backgroundColor: "#dcf8ec", minWidth: "200px" }}
          >
            <div className="ui segment">
              <h4 style={{ marginBottom: 0 }}>
                <div style={{ float: "left" }}>
                  <i
                    className="ui plus square icon"
                    style={{ marginRight: "0.5em", color: "gray" }}
                  />
                  &#x200b;
                </div>
                <div
                  className="ui placeholder"
                  style={{ marginRight: "1.5em", height: "1.2em" }}
                >
                  <div
                    className="long line"
                    style={{ backgroundColor: "initial" }}
                  />
                </div>
                <div style={{ clear: "both" }} />
                <div className="floating ui label">
                  <span style={{ width: "1ch", display: "inline-block" }}>
                    &#x200b;
                  </span>
                </div>
              </h4>
              <div style={{ marginTop: "1rem", marginBottom: "-1rem" }}>
                <div
                  style={{
                    padding: "1em 1em",
                    borderRadius: "0.25rem",
                    border: "1px solid rgba(34, 36, 38, 0.15)",
                    fontSize: "0.75rem",
                    paddingBottom: 0,
                    marginBottom: "1rem",
                  }}
                  className="ui segment"
                >
                  <div className="ui placeholder">
                    <h5 style={{ marginBottom: 0 }}>
                      <span style={{ float: "left" }}>&#x200b;</span>
                      <div className="header" style={{ fontSize: 0 }} />
                      <div style={{ clear: "both" }} />
                    </h5>
                    <div style={{ height: "1rem", backgroundColor: "#fff" }} />
                    <div className="meta">
                      <span style={{ float: "left" }}>&#x200b;</span>
                      <div
                        className="full line"
                        style={{
                          backgroundColor: "initial",
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      />
                      <div style={{ clear: "both" }} />
                    </div>
                    <div
                      className="description"
                      style={{
                        height: "3rem",
                        lineHeight: "1.2rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="full line"
                        style={{ backgroundColor: "initial" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "100%",
                          height: "0.6rem",
                          background:
                            "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1em 1em",
                    borderRadius: "0.25rem",
                    border: "1px solid rgba(34, 36, 38, 0.15)",
                    fontSize: "0.75rem",
                    paddingBottom: 0,
                    marginBottom: "1rem",
                  }}
                  className="ui segment"
                >
                  <div className="ui placeholder">
                    <h5 style={{ marginBottom: 0 }}>
                      <span style={{ float: "left" }}>&#x200b;</span>
                      <div className="header" style={{ fontSize: 0 }} />
                      <div style={{ clear: "both" }} />
                    </h5>
                    <div style={{ height: "1rem", backgroundColor: "#fff" }} />
                    <div className="meta">
                      <span style={{ float: "left" }}>&#x200b;</span>
                      <div
                        className="full line"
                        style={{
                          backgroundColor: "initial",
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      />
                      <div style={{ clear: "both" }} />
                    </div>
                    <div
                      className="description"
                      style={{
                        height: "3rem",
                        lineHeight: "1.2rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="full line"
                        style={{ backgroundColor: "initial" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "100%",
                          height: "0.6rem",
                          background:
                            "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1em 1em",
                    borderRadius: "0.25rem",
                    border: "1px solid rgba(34, 36, 38, 0.15)",
                    fontSize: "0.75rem",
                    paddingBottom: 0,
                    marginBottom: "1rem",
                  }}
                  className="ui segment"
                >
                  <div className="ui placeholder">
                    <h5 style={{ marginBottom: 0 }}>
                      <span style={{ float: "left" }}>&#x200b;</span>
                      <div className="header" style={{ fontSize: 0 }} />
                      <div style={{ clear: "both" }} />
                    </h5>
                    <div style={{ height: "1rem", backgroundColor: "#fff" }} />
                    <div className="meta">
                      <span style={{ float: "left" }}>&#x200b;</span>
                      <div
                        className="full line"
                        style={{
                          backgroundColor: "initial",
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      />
                      <div style={{ clear: "both" }} />
                    </div>
                    <div
                      className="description"
                      style={{
                        height: "3rem",
                        lineHeight: "1.2rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="full line"
                        style={{ backgroundColor: "initial" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "100%",
                          height: "0.6rem",
                          background:
                            "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={event => {
          this.props.history.push(
            `/problems/${this.props.problem.id}`,
            this.props.content,
          );
          event.stopPropagation();
        }}
      >
        <ProblemTitleContainer>
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
              <span style={{ float: "left", marginRight: "0.5em" }}>
                Problem:
              </span>
              {problem}
            </h3>
          </div>
        </ProblemTitleContainer>

        <div style={{ backgroundColor: "#dcf8ec" }}>
          <div
            className="ui segment"
            onClick={event => {
              this.props.toggleOpen();
              event.stopPropagation();
            }}
            style={{
              float: "left",
              margin: "1em 30px 0 30px",
              cursor: "pointer",
            }}
          >
            <GraphHider
              className={"chevron down icon " + (open ? "opened" : "collapsed")}
            />
          </div>

          <GraphContainer>{stages}</GraphContainer>
        </div>
      </div>
    );
  }
}

const commonStyle = css`
  overflow-x: auto;
  overflow-y: hidden;
`;

const GraphContainer = styled.div`
  ${commonStyle}
  padding-top: 1em;
  padding-right: 30px;
  padding-bottom: 30px;
`;

const ProblemTitleContainer = styled.div`
  ${commonStyle}
  background-color: #dcf8ec;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
`;

const GraphHider = styled.i`
  fontsize: 1.07142857rem;
  color: #4b72ab;
  transition: transform 0.3s ease-in-out;

  &.opened {
    transform: rotate(180deg) translateY(-5px);
  }

  &.collapsed {
    transform: rotate(0deg) translateY(-5px);
  }
`;

export default withRouter(StageGraph);
