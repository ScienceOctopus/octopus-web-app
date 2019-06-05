import React, { Component } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import "../App.css";
import { LoginDataContext } from "../LoginContext";
import WebURI from "../urls/WebsiteURIs";
import GlobalSearch from "./GlobalSearch";
import GoblinIDLoginInvitation from "./GoblinIDLoginInvitation";
import LogoutInvitation from "./LogoutInvitation";
import OctopusLogo from "./OctopusLogo";

class Header extends Component {
  static contextType = LoginDataContext;

  render() {
    const loggedIn = this.context.user !== undefined;

    return (
      <header className="ui teal inverted menu" style={styles.header}>
        <div className="ui container">
          <Link to={WebURI.Home} className="header item">
            <OctopusLogo style={styles.logo} className="logo" />
            <Trans>octopus</Trans>
          </Link>
          {loggedIn && (
            <Link to={WebURI.Upload} className="item">
              <i className="ui pencil alternate icon" />
              Publish
            </Link>
          )}
          <GlobalSearch />
          {loggedIn ? (
            <LogoutInvitation user={this.context.user} />
          ) : (
            <GoblinIDLoginInvitation showAvatar state={1337} />
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
};

export default Header;
