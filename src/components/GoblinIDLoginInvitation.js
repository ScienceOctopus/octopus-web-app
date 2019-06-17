import React from "react";
import WebURI from "../urls/WebsiteURIs";

function LinkOnlyIfAcquiredState(props) {
  if (global.session.OAuthState !== undefined) {
    return (
      <a
        className="right item"
        href={WebURI.OrcidLogin(global.session.OAuthState, props.returnPath)}
      >
        {props.children}
      </a>
    );
  } else {
    return <div className="right item">{props.children}</div>;
  }
}

function GoblinIDLoginInvitation(props) {
  return (
    <LinkOnlyIfAcquiredState returnPath={props.returnPath}>
      {props.showAvatar && (
        <img
          src="/images/avatar.jpg"
          className="ui avatar image"
          alt="Generic avatar"
          title="Log in"
        />
      )}
      <span>Log in via ORCiD</span>
    </LinkOnlyIfAcquiredState>
  );
}

export default GoblinIDLoginInvitation;
