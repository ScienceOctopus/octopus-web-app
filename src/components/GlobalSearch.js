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
    event.target.firstChild.firstChild.blur();

    if (this.state.value === "") {
      this.props.history.push("/");
    } else {
      this.setState({ value: "breast cancer" }, () =>
        this.props.history.push(`/problems/${1}`),
      );
    }

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
