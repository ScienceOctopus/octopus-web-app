import React, { Component } from "react";
import styled from "styled-components";

const debounceChangeEvent = (inner, ms = 0) => {
  let timer = null;
  let resolves = [];
  return e => {
    e.persist();
    clearTimeout(timer);
    timer = setTimeout(() => {
      let result = inner(e);
      resolves.forEach(r => r(result));
      resolves = [];
    }, ms);
    return new Promise(r => resolves.push(r));
  };
};

const getUsers = query =>
  fetch(`https://pub.orcid.org/v2.1/search?q=${query}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => res.json());

const getDetails = id =>
  fetch(`https://pub.orcid.org/v2.1/${id}/person`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => res.json());

class UserSearch extends Component {
  selectedUser = undefined;
  constructor(props) {
    super(props);

    this.state = { details: [], loading: false, input: "" };
    this.handleChange = debounceChangeEvent(this.handleChange.bind(this), 150);
    this.handleChangeContainer = this.handleChangeContainer.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleSubmit = () => {
    if (this.selectedUser) {
      this.props.onSelect(this.selectedUser);
    }
    this.setState({ ...this.state, input: "" });
    this.selectedUser = undefined;
  };

  handleChangeContainer(event) {
    this.setState({ details: [], loading: true, input: event.target.value });
    this.handleChange(event);
  }

  async handleChange(event) {
    let users = await getUsers(event.target.value);
    if (!users) {
      return this.setState({ loading: false });
    }

    // Remove already added collaborators from search results
    let foundUsers = users.result.filter(el =>
      this.props.excluded.some(f => f.orcid != el["orcid-identifier"].path),
    );

    // Limit the results to 10
    foundUsers.slice(0, 10);

    // Get user details
    const details =
      (await Promise.all(
        foundUsers.map(u => getDetails(u["orcid-identifier"].path)),
      )) || [];

    this.setState({ ...this.state, details, loading: false });
  }

  handleSelect = user => () => {
    const { name, emails } = user;
    let givenName, familyName, display_name, display_email;

    if (name && name["given-names"] && name["family-name"]) {
      givenName = name["given-names"] ? name["given-names"].value : "";
      familyName = name["family-name"] ? name["family-name"].value : "";
      display_name = `${givenName} ${familyName}`;
    }

    if (emails && emails.email.length > 0) {
      display_email = emails.email[0].email;
    }

    this.setState({
      input: display_name || display_email,
    });

    this.selectedUser = {
      display_name,
      email: display_email,
      orcid: name.path,
    };
  };

  handleBlur() {
    this.setState({
      details: [],
    });
  }

  renderUserList() {
    if (!this.state.details.length) return null;

    return (
      <FloatingUserList>
        {this.state.loading ? "Loading" : ""}
        {this.state.details.map((user, index) => {
          const { name, emails } = user;
          let givenName, familyName, display_name, display_email;

          if (name && name["given-names"] && name["family-name"]) {
            givenName = name["given-names"] ? name["given-names"].value : "";
            familyName = name["family-name"] ? name["family-name"].value : "";
            display_name = `${givenName} ${familyName}`;
          }

          if (emails && emails.email.length > 0) {
            display_email = emails.email[0].email;
          }

          return (
            <UserInfoSelectContainer key={index}>
              <UserInfoContainer onMouseDown={this.handleSelect(user)}>
                <UserName>{display_name}</UserName>
                <UserEmail>{display_email || "(hidden email)"}</UserEmail>
              </UserInfoContainer>
            </UserInfoSelectContainer>
          );
        })}
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
            <div className="ui icon input loading" style={{ width: "50%" }}>
              <input
                style={{ height: "38px" }}
                type="text"
                value={this.state.input}
                placeholder="example@example.com"
                onChange={this.handleChangeContainer}
                onBlur={this.handleBlur}
              />
              {(this.state.loading && <i className="search icon"></i>) || null}
            </div>
            {this.renderUserList()}
            {this.renderMessage()}
          </UserLabelAndList>
        </div>
        <button
          className="ui icon button octopus-theme publication"
          style={{ color: "white" }}
          type="submit"
          onClick={this.handleSubmit}
          disabled={!this.selectedUser}
        >
          Add Collaborator
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

const UserLabelAndList = styled.div`
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
