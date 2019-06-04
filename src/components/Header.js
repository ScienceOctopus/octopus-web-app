import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../App.css";
import WebURI from "../urls/WebsiteURIs";
import GoblinIDLoginInvitation from "./GoblinIDLoginInvitation";
import LogoutInvitation from "./LogoutInvitation";
import { LoginDataContext } from "../LoginContext";
import OctopusLogo from "./OctopusLogo";

class Header extends Component {
  static contextType = LoginDataContext;

  render() {
    const loggedIn = this.context !== undefined;

    return (
      <header className="ui teal inverted menu" style={styles.header}>
        <div className="ui container">
          <Link to={WebURI.Home} className="header item">
            <OctopusLogo style={styles.logo} />
            Octopus
          </Link>
          <Link to={WebURI.Upload} className="item">
            <i className="ui pencil alternate icon" />
            Draft a new publication
          </Link>
          {loggedIn ? (
            <LogoutInvitation />
          ) : (
            <GoblinIDLoginInvitation state={1337} />
          )}
        </div>
      </header>
    );
  }
}

const styles = {
  header: {
    borderRadius: 0,
  },
  logo: {
    marginRight: 1.5 + "em",
  },
  logout: {
    marginLeft: 1 + "em",
  },
};

export default Header;
