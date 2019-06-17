import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SearchField from "./SearchField";
import WebURI, { generateLocalizedPath } from "../urls/WebsiteURIs";

class GlobalSearch extends Component {
  constructor(props) {
    super(props);
    let value = new URLSearchParams(this.props.location.search).get("q") || "";
    this.state = { value };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.target.firstChild.firstChild.blur();

    this.props.history.push(
      generateLocalizedPath(WebURI.Search(this.state.value)),
    );

    event.preventDefault();
  };

  render() {
    return (
      <SearchField
        className={this.props.className}
        placeholder="Search science"
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        value={this.state.value}
      />
    );
  }
}

export default withRouter(GlobalSearch);
