import React, { Component } from "react";
import Api from "../api";
import styled from "styled-components";

const MAX_USERS_DISPLAY = 3;

class UserSearch extends Component {
  selectedUser = undefined;
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      users: [],
      searchError: undefined,
    };
  }

  handleSubmit = () => {
    if (this.selectedUser) {
      this.props.onSelect(this.selectedUser);
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

  handleSelect = user => () => {
    this.setState({
      input: user.display_name || user.email,
    });
    this.selectedUser = user;
  };

  updateUserList = users => {
    this.setState({
      users: users
        .filter(x => x.id !== global.session.user.id)
        .filter(
          x =>
            !this.props.excluded ||
            !this.props.excluded.find(y => y.id === x.id),
        )
        .slice(0, MAX_USERS_DISPLAY),
    });
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
          <UserInfoSelectContainer>
            <UserInfoContainer
              key={user.id}
              onMouseDown={this.handleSelect(user)}
            >
              <UserName>{user.display_name}</UserName>
              <UserEmail>{user.email || "(hidden email)"}</UserEmail>
            </UserInfoContainer>
          </UserInfoSelectContainer>
        ))}
      </FloatingUserList>
    );
  }

  setMessage(searchError) {
    this.setState({ searchError });
  }

  clearMessage() {
    this.setState({
      searchError: undefined,
    });
  }

  renderMessage() {
    if (!this.state.searchError) return null;
    return <SearchError>{this.state.searchError}</SearchError>;
  }

  render() {
    return (
      <>
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
            {this.renderMessage()}
          </UserLabelAndList>
        </div>
        <button className="ui button" type="submit" onClick={this.handleSubmit}>
          Add New Collaborator
        </button>
      </>
    );
  }
}

const SearchError = styled.label`
  color: red;
`;

const UserInfoSelectContainer = styled.div`
  :hover {
    background-color: var(--octopus-theme-background);
  }
  padding-left: 1rem;
  padding-right: 1rem;
`;

const FloatingUserList = styled.div`
  background-color: white;
  border: 1px solid var(--octopus-theme-accent);
  border-radius: 3px;
  position: absolute;
  top: 38px;
  left: 0;
  z-index: 999;
  max-width: 100% !important;
`;

const UserLabelAndList = styled.span`
  background-color: wheat;
  position: relative;
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  :hover {
    cursor: pointer;
  }
`;

const UserName = styled.label`
  color: black;
  :hover {
    cursor: pointer;
  }
`;

const UserEmail = styled.label`
  color: grey;
  :hover {
    cursor: pointer;
  }
`;

export default UserSearch;
