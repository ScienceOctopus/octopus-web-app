import React, { Component } from "react";
import "./App.css";
import AppRouter from "./AppRouter";
import Header from "./components/Header";
import OctopusSlackFeedback from "./components/SlackFeedback/OctopusSlackFeedback";

// TODO: Can change this to be a dynamic import
import DebugReloadButton from "./components/DebugReloadButton";

import "./i18n";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <AppRouter />
        <OctopusSlackFeedback />
        {process.SHOW_DEBUG_SWITCH && <DebugReloadButton />}
      </div>
    );
  }
}

export default App;
