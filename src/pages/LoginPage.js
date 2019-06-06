import React, { Component } from "react";
import { LoginDataContext } from "../LoginContext";
import { Redirect, withRouter } from "react-router-dom";
import QueryString from "query-string";
import Api from "../api";

class LoginPage extends Component {
  static contextType = LoginDataContext;

  constructor(props) {
    super(props);

    this.state = { redirect: undefined };

    let params = QueryString.parse(props.location.search);

    if (params.logout === undefined) {
      Api()
        .user(params.user)
        .get()
        .then(user => {
          this.context.login({
            id: params.user,
            display_name: user.display_name,
          });
          this.setState({ redirect: params.state });
        });
    } else {
      this.state.redirect = "";
    }
  }

  render() {
    return (
      (this.state.redirect != undefined && (
        <Redirect to={this.state.redirect} />
      )) || <h3 style={{ textAlign: "center" }}>Logging you in ...</h3>
    );
  }
}

export default withRouter(LoginPage);
