import React from "react";
import ApiURI from "../urls/ApiURIs";
import Api from "../api";

function LogoutInvitation() {
  const user = global.session.user;

  return (
    <div className="right menu">
      <div className="item">
        <img
          src={
            ApiURI.UsersEndpoint + global.session.user.id + ApiURI.UserAvatar
          }
          className="ui right spaced avatar image"
          alt={`Avatar of ${user.display_name}`}
        />
        <strong>{user.display_name}</strong>
      </div>
      <div className="item">
        <button
          className="compact ui labeled icon button"
          onClick={() => {
            Api()
              .authentication()
              .discard()
              .get();
            window.location.href = "/";
          }}
        >
          <i className="ui sign out icon" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default LogoutInvitation;
