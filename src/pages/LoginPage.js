import React, { Component } from "react";
import { LoginDataContext } from "../LoginContext";
import { Redirect, withRouter } from "react-router-dom";
import QueryString from "query-string";
import Api from "../api";

class LoginPage extends Component {
  static contextType = LoginDataContext;

  constructor(props) {
    super(props);

    let params = QueryString.parse(props.location.search);

    Api()
      .user(params.user)
      .get()
      .then(user =>
        this.context.login({
          id: params.user,
          display_name: user.display_name,
        }),
      );
  }

  render() {
    return <Redirect to="" />;
  }
}

export default withRouter(LoginPage);
