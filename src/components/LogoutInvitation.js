import React from "react";

function LogoutInvitation() {
  return (
    <div className="right menu">
    <div className="item">
	<img
	    src="/images/avatar.jpg"
	    className="ui right spaced avatar image"
	    alt="Avatar of Alex"
	/>
	<strong>Alex</strong>
    </div>
    <div className="item">
	<a
	    className="compact ui labeled icon button"
	    href="/login?logout=1"
	>
		<i className="ui sign out icon"></i>
		Logout
	</a>
    </div>
    </div>
  );
}

export default LogoutInvitation;
