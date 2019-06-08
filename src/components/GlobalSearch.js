import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SearchField from "./SearchField";
import WebURI, { generateLocalizedPath, RouterURI } from "../urls/WebsiteURIs";

class GlobalSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.target.firstChild.firstChild.blur();

    this.props.history.push(generateLocalizedPath(WebURI.Search));

    event.preventDefault();
  };

  render() {
    return (
      <SearchField
        placeholder="Search science"
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        value={this.state.value}
      />
    );
  }
}

export default withRouter(GlobalSearch);
