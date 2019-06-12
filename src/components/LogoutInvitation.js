import React from "react";
import Api from "../api";

function LogoutInvitation() {
  return (
    <div className="item">
      <button
        className="compact ui labeled icon button"
        onClick={() => {
          Api()
            .authentication()
            .discard()
            .get()
            .then(() => (window.location.href = "/"));
        }}
      >
        <i className="ui sign out icon" />
        Logout
      </button>
    </div>
  );
}

export default LogoutInvitation;
