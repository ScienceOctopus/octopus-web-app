import "core-js/stable";
import React, { Component } from "react";
import Api from "./api";
import AppRouter from "./AppRouter";
import Header from "./components/Header";
import OctopusSlackFeedback from "./components/SlackFeedback/OctopusSlackFeedback";

// TODO: Can change this to be a dynamic import
import DebugReloadButton from "./components/DebugReloadButton";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import "./i18n";
import GlobalStyle from "./GlobalStyle";

class App extends Component {
  constructor() {
    super();

    // Initialise global login state
    global.session = {
      user: undefined,
      OAuthState: undefined,
    };

    Api()
      .authentication()
      .state()
      .get()
      .then(res => {
        global.session = { user: res.user, OAuthState: res.OAuthState };
        this.forceUpdate();
      });
  }

  render() {
    // TODO: investigate whether this Provider is necessary
    return (
      <div className="app">
        <GlobalStyle />
        <Header />
        <AppRouter />
        <OctopusSlackFeedback />
        {process.SHOW_DEBUG_SWITCH && <DebugReloadButton />}
      </div>
    );
  }
}

export default App;
