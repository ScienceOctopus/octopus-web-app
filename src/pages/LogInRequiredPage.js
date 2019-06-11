import React from "react";
import WebURI from "../urls/WebsiteURIs";
import { withRouter } from "react-router-dom";

const LogInRequiredPage = withRouter(props => {
  return (
    <div className="ui main text container">
      <div className="ui negative icon message">
        <i className="key icon" />
        <a
          href={WebURI.OrcidLogin(
            global.session.OAuthState,
            props.location.pathname,
          )}
        >
          <div className="content">
            <div className="header">Log-in required</div>
            <p>Logging in via your ORCiD is required to post publications.</p>
          </div>
        </a>
      </div>
    </div>
  );
});

export const loginRequired = Child => props => {
  if (global.session.user === undefined) {
    return <LogInRequiredPage />;
  }

  return <Child {...props} />;
};

export default LogInRequiredPage;
