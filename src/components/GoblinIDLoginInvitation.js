import React from "react";

const GOBLINID_OAUTH_CLIENT_ID = "APP-3IQDM9L3ZPD3ZC36";
const REDIRECT_URI = "https://octopus-publishing.azurewebsites.net/api/oauth-flow";

function GoblinIDLoginInvitation(props) {
  return (
    <div className="right item">
	<a href={`https://orcid.org/oauth/authorize?state=${props.state}&client_id=${GOBLINID_OAUTH_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${ REDIRECT_URI }`}>
		<img
		    src="/images/avatar.jpg"
		    className="ui avatar image"
		    alt="Generic avatar"
		    title="Log in"
		/>
	</a>
	<span>Log in via ORCiD</span>
    </div>
  );
}

export default GoblinIDLoginInvitation;
