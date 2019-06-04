import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../App.css";
import WebURI from "../urls/WebsiteURIs";
import SimpleNav from "./SimpleNav";

const SHOW_SIMPLE_NAV = false;

class Header extends Component {
  render() {
    return (
      <header className="ui teal inverted menu" style={styles.header}>
        <div className="ui container">
          <Link to={WebURI.Home} className="header item">
            <img
              className="logo"
              src="/images/octopus.png"
              alt="Octopus Logo"
              style={styles.logo}
            />
            Octopus
          </Link>
          <Link to={WebURI.Upload} className="item">
            <i className="ui pencil alternate icon" />
            Draft a new publication
          </Link>

          <div className="right item">
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
            {/*<a href="/login?redirect">
              <img
                src="/images/avatar.jpg"
                className="ui avatar image"
                alt="Generic avatar"
                title="Log in"
              />
            </a>
            <span>Log in via ORCiD</span>*/}
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
  },
  logo: {
    marginRight: 1.5 + "em",
  },
  logout: {
    marginLeft: 1 + "em",
  },
};

export default Header;
