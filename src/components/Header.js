import React, { Component } from "react";
import { Trans } from "react-i18next";
import { withRouter } from "react-router-dom";
import "../App.css";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import GlobalSearch from "./GlobalSearch";
import GoblinIDLoginInvitation from "./GoblinIDLoginInvitation";
import UserIconName from "./UserIconName";
import LogoutInvitation from "./LogoutInvitation";
import OctopusLogo from "./OctopusLogo";
import styled from "styled-components";

class Header extends Component {
  render() {
    const loggedIn = global.session.user !== undefined;

    return (
      <header className="ui teal inverted menu" style={styles.header}>
        <div className="ui container" style={{ display: "block" }}>
          <HeaderItem>
            <LocalizedLink to={WebURI.Home} className="header item">
              <OctopusLogo style={styles.logo} className="logo" />
              <Trans>octopus</Trans>
            </LocalizedLink>
          </HeaderItem>
          {loggedIn && (
            <HeaderItem>
              <LocalizedLink to={WebURI.Upload} className="item">
                <i className="ui pencil alternate icon" />
                Publish your work
              </LocalizedLink>
            </HeaderItem>
          )}
          <HeaderItem>
            <GlobalSearch />
          </HeaderItem>
          {loggedIn ? (
            <>
              <HeaderItem>
                <UserIconName />
              </HeaderItem>
              <HeaderItem>
                <LogoutInvitation />
              </HeaderItem>
            </>
          ) : (
            <HeaderItem>
              <GoblinIDLoginInvitation
                showAvatar
                returnPath={this.props.location.pathname}
              />
            </HeaderItem>
          )}
        </div>
      </header>
    );
  }
}

const styles = {
  header: {
    borderRadius: 0,
    paddingBottom: "2px",
    textAlign: "center",
    display: "block",
  },
  logo: {
    marginRight: 1.5 + "em",
  },
};

const HeaderItem = styled.div`
  display: inline-block;
  border: 2px solid #009991;
  margin: 0 -1px -2px -1px;
  vertical-align: top;
  line-height: 32px;

  & > :first-child {
    height: 64px;
  }

  & > :first-child::before {
    width: 0 !important;
  }
`;

export default withRouter(Header);
