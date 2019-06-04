import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SearchField from "./SearchField";

class GlobalSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    this.props.history.push(`/problems/${1}`);
    event.preventDefault();
  };

  render() {
    return (
      <SearchField
        placeholder="Search for anything"
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default withRouter(GlobalSearch);
