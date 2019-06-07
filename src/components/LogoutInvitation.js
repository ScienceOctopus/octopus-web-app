import React from "react";
import ApiURI from "../urls/ApiURIs";

function LogoutInvitation() {
  const user = global.session.user;

  return (
    <div className="right menu">
      <div className="item">
        <img
          src={ApiURI.UsersEndpoint + global.session.user.id + ApiURI.UserAvatar}
          className="ui right spaced avatar image"
          alt={`Avatar of ${user.display_name}`}
        />
        <strong>{user.display_name}</strong>
      </div>
      <div className="item">
        <a className="compact ui labeled icon button" href="/login?logout=1">
          <i className="ui sign out icon" />
          Logout
        </a>
      </div>
    </div>
  );
}

export default LogoutInvitation;
