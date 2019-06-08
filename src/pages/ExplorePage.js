import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import WebURI, {
  LocalizedRedirect,
  generateLocalizedPath,
} from "../urls/WebsiteURIs";

class ExplorePage extends Component {
  render() {
    return <LocalizedRedirect to={generateLocalizedPath(WebURI.Search)} />;
  }
}

export default withRouter(ExplorePage);
