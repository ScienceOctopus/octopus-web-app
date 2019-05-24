import React, { Component } from "react";
import "./App.css";
import DefaultAppView from "./DefaultAppView";

class App extends Component {
  constructor(props) {
    super(props);
  }

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
