import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { LocalizedRedirect, RouterURI } from "../urls/WebsiteURIs";
import { generatePath } from "react-router-dom";

class ExplorePage extends Component {
  render() {
    return (
      <LocalizedRedirect to={generatePath(RouterURI.Problem, { id: 1 })} />
    );
  }
}

export default withRouter(ExplorePage);
