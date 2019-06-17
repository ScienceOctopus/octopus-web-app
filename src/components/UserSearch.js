import React, { Component } from "react";
import Api from "../api";
import styled from "styled-components";

const MAX_USERS_DISPLAY = 3;

class UserSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      users: [],
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
      .then(this.updateUserList)
      .catch(this.handleBadUserList);
  }

  handleBadUserList = () => {
    this.clearUserList();
  };

  updateUserList = users => {
    this.setState({ users: users.slice(0, MAX_USERS_DISPLAY) });
  };

  handleBlur = () => {
    this.clearUserList();
  };

  clearUserList = () => {
    this.updateUserList([]);
  };

  renderUserList() {
    if (!this.state.users.length) return null;

    return (
      <FloatingUserList>
        {this.state.users.map(user => (
          <UserInfoContainer key={user.id} onClick={this.props.onSelect}>
            <UserName>{user.display_name}</UserName>
            <UserEmail> {user.email || "(hidden email)"}</UserEmail>
          </UserInfoContainer>
        ))}
      </FloatingUserList>
    );
  }

  render() {
    return (
      <div className="inline field">
        <label>Username or Email Address</label>
        <UserLabelAndList>
          <input
            style={{ height: "38px" }}
            type="text"
            value={this.state.input}
            placeholder="example@example.com"
            onChange={this.handleInputChange}
            onBlur={this.handleBlur}
          />
          {this.renderUserList()}
        </UserLabelAndList>
      </div>
    );
  }
}

const FloatingUserList = styled.div`
  background-color: white;
  border: 1px solid var(--octopus-theme-accent);
  border-radius: 3px;
  position: absolute;
  top: 38px;
  left: 0;
  padding-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  z-index: 999;
`;

const UserLabelAndList = styled.span`
  background-color: wheat;
  position: relative;
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 0.5rem;
`;

const UserName = styled.label`
  color: black;
`;

const UserEmail = styled.label`
  color: grey;
`;

export default UserSearch;
