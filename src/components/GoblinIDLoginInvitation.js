import React from "react";
import WebURI from "../urls/WebsiteURIs";

function GoblinIDLoginInvitation(props) {
  return (
    <div className="right item">
      <a href={WebURI.OrcidLogin(global.session)}>
        {props.showAvatar && (
          <img
            src="/images/avatar.jpg"
            className="ui avatar image"
            alt="Generic avatar"
            title="Log in"
          />
        )}
      </a>
      <span>Log in via ORCiD</span>
    </div>
  );
}

export default GoblinIDLoginInvitation;
