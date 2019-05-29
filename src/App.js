import React, { Component } from "react";
import "./App.css";
import AppRouter from "./AppRouter";
import Header from "./components/Header";
import OctopusSlackFeedback from "./components/SlackFeedback/OctopusSlackFeedback";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <AppRouter />
        <OctopusSlackFeedback />
      </div>
    );
  }
}

export default App;
