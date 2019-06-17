import React from "react";
import { withRouter } from "react-router-dom";
import LinkOnlyIfAcquiredState from "../components/LinkOnlyIfAcquiredState";

const LogInRequiredPage = withRouter(props => {
  return (
    <div className="ui main text container">
      <div className="ui negative icon message">
        <i className="key icon" />
        <LinkOnlyIfAcquiredState returnPath={props.location.pathname}>
          <div className="content">
            <div className="header">Log-in required</div>
            <p>Logging in via your ORCiD is required to access this page.</p>
          </div>
        </LinkOnlyIfAcquiredState>
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
