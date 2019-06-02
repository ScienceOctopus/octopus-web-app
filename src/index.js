import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

if (process.env.NODE_ENV === "development") {
  const preventDebug = window.sessionStorage.DEBUG_PREVENT === "true";
  process.DEBUG_MODE =
    process.env.NODE_ENV === "development" &&
    process.env.REACT_APP_DEBUG === "true" &&
    !preventDebug;

  process.SHOW_DEBUG_SWITCH = process.DEBUG_MODE || preventDebug;

  if (process.DEBUG_MODE) {
    console.info("Running in DEBUG mode");
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
