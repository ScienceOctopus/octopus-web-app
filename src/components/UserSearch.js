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
    this.setState({
      input: e.target.value,
    });
    if (e.target.value.length > 2) {
      this.fetchUsersByInput();
    }
  };

  async fetchUsersByInput() {
    let users = [];
    const usersResponse = await fetch(
      `https://pub.orcid.org/v2.1/search?q=${this.state.input}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then(res => res.json());

    const foundUsers = usersResponse.result;

    await foundUsers.forEach(async foundUser => {
      const userDetails = await fetch(
        `https://pub.orcid.org/v2.1/${foundUser["orcid-identifier"].path}/person`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then(res => res.json());

      const { name, emails } = userDetails;
      let givenName, familyName, display_name, display_email;
      if (name && name["given-names"] && name["family-name"]) {
        givenName = name["given-names"] ? name["given-names"].value : "";
        familyName = name["family-name"] ? name["family-name"].value : "";
        display_name = `${givenName} ${familyName}`;
      }
      if (emails && emails.email.length > 0) {
        display_email = emails.email[0].email;
      }
      users.push({
        orcid: foundUser["orcid-identifier"].path,
        display_name,
        display_email,
      });
      this.updateUserList(users);
    });
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
        .filter(x => x.orcid !== global.session.user.orcid)
        .filter(
          x =>
            !this.props.excluded ||
            !this.props.excluded.find(y => y.orcid === x.orcid),
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
    console.log(this.state.users);
    if (!this.state.users.length) return null;
    return (
      <FloatingUserList>
        {this.state.users.map(user => (
          <UserInfoSelectContainer>
            <UserInfoContainer
              key={user.orcid}
              onMouseDown={this.handleSelect(user)}
            >
              <UserName>{user.display_name}</UserName>
              <UserEmail>{user.display_email || "(hidden email)"}</UserEmail>
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
      <div>
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
      </div>
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
