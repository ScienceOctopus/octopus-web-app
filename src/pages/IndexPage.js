import React, { Component } from "react";
import ProblemPage from "./ProblemPage";

export default class IndexPage extends Component {
  render() {
    return <ProblemPage params={{ id: 4 }} />;
  }
}
