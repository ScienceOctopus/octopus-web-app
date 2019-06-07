import React, { Component } from "react";
import Api from "./api";
import AppRouter from "./AppRouter";
import Header from "./components/Header";
import OctopusSlackFeedback from "./components/SlackFeedback/OctopusSlackFeedback";

// TODO: Can change this to be a dynamic import
import DebugReloadButton from "./components/DebugReloadButton";

import "./i18n";

class App extends Component {
  constructor() {
    super();

    this.state = { user: undefined, OAuthState: undefined };

    // Initialise global login state
    global.session = this.state;
    Api()
      .authentication()
      .state()
      .get()
      .then(res => {
        global.session.OAuthState = res.state;
        this.setState({ OAuthState: res.state });
      });
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
