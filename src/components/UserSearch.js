import React, { Component } from "react";
import Api from "../api";

class UserSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
    };
  }

  handleSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  handleInputChange = e => {
    this.setState(
      {
        input: e.target.value,
      },
      this.fetchUsersByInput,
    );
  };

  fetchUsersByInput() {
    Api()
      .users()
      .getQuery(this.state.input)
      .then(this.updateUserList);
  }

  updateUserList = users => {
    console.log(33, users);
  };

  render() {
    return (
      <div className="inline field">
        <label>Username or Email Address</label>
        <input
          type="text"
          value={this.state.input}
          placeholder="example@example.com"
          onChange={this.handleInputChange}
        />
      </div>
    );
  }
}

export default UserSearch;
