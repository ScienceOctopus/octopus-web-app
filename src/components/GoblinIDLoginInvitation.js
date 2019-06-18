import React from "react";
import LinkOnlyIfAcquiredState from "./LinkOnlyIfAcquiredState";

function GoblinIDLoginInvitation(props) {
  return (
    <LinkOnlyIfAcquiredState
      className="right item"
      returnPath={props.returnPath}
    >
      <img
        src="/images/avatar.jpg"
        className="ui avatar image"
        alt="Generic avatar"
        title="Log in"
      />
      <span>Log in via ORCiD</span>
    </LinkOnlyIfAcquiredState>
  );
}

export default GoblinIDLoginInvitation;
