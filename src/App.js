import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header";
import OctopusSlackFeedback from "./components/SlackFeedback/OctopusSlackFeedback";
import StageGraph from "./components/StageGraph";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <StageGraph />
        <OctopusSlackFeedback />
      </div>
    );
  }
}

export default App;
