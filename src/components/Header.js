import React, { Component } from "react";
import "../App.css";

class Header extends Component {
  render() {
    return (
      <header class="ui teal inverted menu" style={{ borderRadius: 0 }}>
        <div class="ui container">
          <a class="header item" /*href="/"*/>
            <img
              class="logo"
              src="/images/octopus.png"
              alt="Octopus Logo"
              style={{ marginRight: 1.5 + "em" }}
            />
            Octopus
          </a>

          <a class="item">
            <i class="ui pencil alternate icon" />
            Draft a new publication
          </a>

          <div class="right item">
            <img
              src="/images/avatar.jpg"
              class="ui avatar image"
              alt="Avatar of Steve"
            />
            <strong>Steve</strong>
            <a
              style={{ marginLeft: 1 + "em" }}
              class="ui button"
              /*href="/login?logout=1"*/
            >
              Logout
            </a>
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
      </header>
    );
  }
}

export default Header;
