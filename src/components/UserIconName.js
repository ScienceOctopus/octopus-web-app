import React from "react";
import ApiURI from "../urls/ApiURIs";

function UserIconName() {
  const user = global.session.user;

  return (
    <div className="item">
      <img
        src={ApiURI.UsersEndpoint + global.session.user.id + ApiURI.UserAvatar}
        className="ui right spaced avatar image"
        alt={`Avatar of ${user.display_name}`}
      />
      <strong>{user.display_name}</strong>
    </div>
  );
}

export default UserIconName;
