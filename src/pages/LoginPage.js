import React, { Component } from "react";
import ApiURI from "../urls/ApiURIs";
import { LoginDataContext } from "../LoginContext";
import { Redirect, withRouter } from "react-router-dom";

class LoginPage extends Component {
  static contextType = LoginDataContext;

  constructor(props) {
    super(props);

    let params = (props.match ? props.match : props).params;
  }

  render() {
    return (<Redirect to='' />);
  }
}

export default withRouter(LoginPage);