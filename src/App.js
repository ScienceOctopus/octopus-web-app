import React, { Component } from "react";
import "./App.css";
import DefaultAppView from "./DefaultAppView";

class App extends Component {
  render() {
    return (
      <div className="App">
        <DefaultAppView />
        {/* <ReferenceSelection />
        <ReferenceSelection /> */}
      </div>
    );
  }
}

export default App;
