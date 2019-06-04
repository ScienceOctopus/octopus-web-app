import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../App.css";
import WebURI from "../urls/WebsiteURIs";
import SimpleNav from "./SimpleNav";
import { LoginDataContext } from "../LoginContext";
import OctopusLogo from "./OctopusLogo";

const SHOW_SIMPLE_NAV = false;

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

          <div className="right item">
            {loggedIn ? (
              <div>
                <img
                  src="/images/avatar.jpg"
                  className="ui avatar image"
                  alt="Avatar of Alex"
                />
                <strong>Alex</strong>
                <div
                  style={styles.logout}
                  className="ui button"
                  /*href="/login?logout=1"*/
                >
                  Logout
                </div>
              </div>
            ) : (
              <div>
                <a href="https://orcid.org/oauth/authorize?state=1337&client_id=APP-3IQDM9L3ZPD3ZC36&response_type=code&scope=/authenticate&redirect_uri=https://octopus-publishing.azurewebsites.net/api/oauth-flow">
                  <img
                    src="/images/avatar.jpg"
                    className="ui avatar image"
                    alt="Generic avatar"
                    title="Log in"
                  />
                </a>
                <span>Log in via ORCiD</span>
              </div>
            )}
          </div>
        </div>

        {SHOW_SIMPLE_NAV && <SimpleNav />}
      </header>
    );
  }
}

const styles = {
  header: {
    borderRadius: 0,
    marginBottom: 0,
  },
  logo: {
    marginRight: 1.5 + "em",
  },
  logout: {
    marginLeft: 1 + "em",
  },
};

export default Header;
