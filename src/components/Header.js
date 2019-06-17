import React, { Component } from "react";
import { Trans } from "react-i18next";
import { withRouter } from "react-router-dom";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import GlobalSearch from "./GlobalSearch";
import GoblinIDLoginInvitation from "./GoblinIDLoginInvitation";
import UserIconName from "./UserIconName";
import LogoutInvitation from "./LogoutInvitation";
import OctopusLogo from "./OctopusLogo";

class Header extends Component {
	activeIfAt = (address) =>
	{
		return (window.location.pathname.startsWith(address) ? "active " : "");
	}

  render() {
    const loggedIn = global.session.user !== undefined;

    return (
      <nav
        className="ui inverted octopus-theme accent menu"
        id="octopus-navigation"
      >
        <div className="ui container" id="octopus-navigation-container">
          <LocalizedLink to={WebURI.Home} className="header item">
            <OctopusLogo style={styles.logo} className="logo" />
            <Trans>octopus</Trans>
          </LocalizedLink>
          {loggedIn && (
            <LocalizedLink to={WebURI.Upload} className={this.activeIfAt(WebURI.Upload) + "item"}>
              <i className="ui pencil alternate icon" />
              Publish your work
            </LocalizedLink>
          )}
          <GlobalSearch />
          {loggedIn ? (
            <div className="right menu" id="octopus-navigation-login-items">
              <LocalizedLink to={WebURI.Profile} className={this.activeIfAt(WebURI.Profile) + "item"}>
                <UserIconName />
              </LocalizedLink>
              <LogoutInvitation />
            </div>
          ) : (
            <GoblinIDLoginInvitation
              showAvatar
              returnPath={this.props.location.pathname}
            />
          )}
        </div>
      </nav>
    );
  }
}

const styles = {
  logo: {
    marginRight: 1.5 + "em",
  },
};

export default withRouter(Header);
