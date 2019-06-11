import React from "react";
import WebURI from "../urls/WebsiteURIs";

function GoblinIDLoginInvitation(props) {
  return (
    <a
      className="right item"
      href={WebURI.OrcidLogin(global.session.OAuthState, props.returnPath)}
    >
      {props.showAvatar && (
        <img
          src="/images/avatar.jpg"
          className="ui avatar image"
          alt="Generic avatar"
          title="Log in"
        />
      )}
      <span>Log in via ORCiD</span>
    </a>
  );
}

export default GoblinIDLoginInvitation;
