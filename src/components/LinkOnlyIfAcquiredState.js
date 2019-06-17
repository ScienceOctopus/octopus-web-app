import React from "react";
import WebURI from "../urls/WebsiteURIs";

export default function LinkOnlyIfAcquiredState(props) {
  if (global.session.OAuthState !== undefined) {
    return (
      <a
        className={props.className}
        href={WebURI.OrcidLogin(global.session.OAuthState, props.returnPath)}
      >
        {props.children}
      </a>
    );
  } else {
    return <div className={props.className}>{props.children}</div>;
  }
}