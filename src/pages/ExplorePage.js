import React, { Component } from "react";

import { Redirect, withRouter } from "react-router-dom";

import WebURI from "../urls/WebsiteURIs";

class ExplorePage extends Component {
  render() {
    return <Redirect to="/problems/1" />;
  }
}

export default withRouter(ExplorePage);
