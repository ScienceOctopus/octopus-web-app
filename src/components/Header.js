import React, { Component } from "react";
import { Trans } from "react-i18next";
import { withRouter } from "react-router-dom";
import "../App.css";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import GlobalSearch from "./GlobalSearch";
import GoblinIDLoginInvitation from "./GoblinIDLoginInvitation";
import LogoutInvitation from "./LogoutInvitation";
import OctopusLogo from "./OctopusLogo";

class Header extends Component {
  render() {
    const loggedIn = global.session.user !== undefined;

    return (
      <header className="ui teal inverted menu" style={styles.header}>
        <div className="ui container">
          <LocalizedLink to={WebURI.Home} className="header item">
            <OctopusLogo style={styles.logo} className="logo" />
            <Trans>octopus</Trans>
          </LocalizedLink>
          {loggedIn && (
            <LocalizedLink to={WebURI.Upload} className="item">
              <i className="ui pencil alternate icon" />
              Publish your work
            </LocalizedLink>
          )}
          <GlobalSearch />
          {loggedIn ? (
            <LogoutInvitation />
          ) : (
            <GoblinIDLoginInvitation
              showAvatar
              returnPath={this.props.location.pathname}
            />
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

export default withRouter(Header);
