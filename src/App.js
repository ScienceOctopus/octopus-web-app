import React, { Component } from "react";
import "./App.css";
import AppRouter from "./AppRouter";
import Header from "./components/Header";
import { LoginDataContext } from "./LoginContext";
import OctopusSlackFeedback from "./components/SlackFeedback/OctopusSlackFeedback";

// TODO: Can change this to be a dynamic import
import DebugReloadButton from "./components/DebugReloadButton";

import "./i18n";

class App extends Component {
  constructor() {
    super();

    this.login = data => {
      this.setState(state => ({ user: data }));
    };

    this.state = {
      user: undefined,
      login: this.login,
    };
  }

  render() {
    // TODO: investigate whether this Provider is necessary
    return (
      <div className="App">
        <LoginDataContext.Provider value={this.state}>
          <Header />
          <AppRouter />
          <OctopusSlackFeedback />
          {process.SHOW_DEBUG_SWITCH && <DebugReloadButton />}
        </LoginDataContext.Provider>
      </div>
    );
  }
}

export default App;
