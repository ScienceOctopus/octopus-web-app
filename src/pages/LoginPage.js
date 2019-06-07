import QueryString from "query-string";
import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = { redirect: undefined };
    const params = QueryString.parse(props.location.search);

    if (props.location.pathname === params.redirect) {
      // Prevent infinite loops
      params.redirect = "";
    }

    this.state.redirect = params.redirect;
  }

  render() {
    return (
      <>
        <Redirect to={this.state.redirect} />
        <h3 style={{ textAlign: "center" }}>Logging you in ...</h3>
      </>
    );
  }
}

export default withRouter(LoginPage);
