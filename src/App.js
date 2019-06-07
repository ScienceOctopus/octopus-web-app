import React, { Component } from "react";
import AppRouter from "./AppRouter";
import Header from "./components/Header";
import OctopusSlackFeedback from "./components/SlackFeedback/OctopusSlackFeedback";

// TODO: Can change this to be a dynamic import
import DebugReloadButton from "./components/DebugReloadButton";

import "./i18n";

class App extends Component {
  constructor() {
    super();

// Initialise global login state
    global.user = undefined;
	global.session = 1337;
  }

  render() {
    // TODO: investigate whether this Provider is necessary
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
