import React, { Component } from "react";
import { Trans } from "react-i18next";
import { withRouter } from "react-router-dom";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import GlobalSearch from "./GlobalSearch";
import OrcIDLoginInvitation from "./OrcIDLoginInvitation";
import UserIconName from "./UserIconName";
import LogoutInvitation from "./LogoutInvitation";
import OctopusLogo from "./OctopusLogo";

class Header extends Component {
  activeIfAt = (addresses, exact) => {
    let match;

    if (exact) {
      match = addresses.some(address => window.location.pathname === address);
    } else {
      match = addresses.some(address =>
        window.location.pathname.startsWith(address),
      );
    }

    return match ? "active " : "";
  };

  render() {
    const loggedIn = global.session.user !== undefined;

    return (
      <nav
        className="ui inverted octopus-theme accent menu"
        id="octopus-navigation"
      >
        <div className="ui container" id="octopus-navigation-container">
          <LocalizedLink
            to={WebURI.Home}
            className={
              this.activeIfAt([WebURI.Home, WebURI.More, WebURI.FAQ], true) +
              "header item"
            }
          >
            <OctopusLogo style={styles.logo} className="logo" />
            <Trans>octopus</Trans>
          </LocalizedLink>

          <LocalizedLink
            to={WebURI.Explore}
            className={
              this.activeIfAt(
                [WebURI.Explore,
                WebURI.Search("")]
              ) + "item"
            }
          >
            <i className="ui copy outline alternate icon" />
            All publications
          </LocalizedLink>


          <LocalizedLink
            to={WebURI.Upload}
            className={
              this.activeIfAt(
                [WebURI.Upload, WebURI.ProblemCreation],
                false,
              ) + "item"
            }
          >
            <i className="ui pencil alternate icon" />
            Publish your work
          </LocalizedLink>

          <GlobalSearch
            className={this.activeIfAt(
              [
                // WebURI.Problem,
                // WebURI.Publication,
              ],
              false,
            )}
          />

          {loggedIn ? (
            <div className="right menu" id="octopus-navigation-login-items">
              <LocalizedLink
                to={WebURI.Profile}
                className={this.activeIfAt([WebURI.Profile], false) + "item"}
              >
                <UserIconName />
              </LocalizedLink>
              <LogoutInvitation />
            </div>
          ) : (
            <OrcIDLoginInvitation
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
