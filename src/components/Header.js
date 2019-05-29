import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../App.css";
import WebURI from "../urls/WebsiteURIs";
import SimpleNav from "./SimpleNav";

const SHOW_SIMPLE_NAV = false;

class Header extends Component {
  render() {
    return (
      <header class="ui teal inverted menu" style={{ borderRadius: 0 }}>
        <div class="ui container">
          <Link to={WebURI.Home} class="header item">
            <img
              class="logo"
              src="/images/octopus.png"
              alt="Octopus Logo"
              style={{ marginRight: 1.5 + "em" }}
            />
            Octopus
          </Link>
          <Link to={WebURI.UploadPublication} class="item">
            <i class="ui pencil alternate icon" />
            Draft a new publication
          </Link>

          <div class="right item">
            <img
              src="/images/avatar.jpg"
              class="ui avatar image"
              alt="Avatar of Steve"
            />
            <strong>Steve</strong>
            <div
              style={{ marginLeft: 1 + "em" }}
              class="ui button"
              /*href="/login?logout=1"*/
            >
              Logout
            </div>
            {/*<a href="/login?redirect">
              <img
                src="/images/avatar.jpg"
                class="ui avatar image"
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

export default Header;
