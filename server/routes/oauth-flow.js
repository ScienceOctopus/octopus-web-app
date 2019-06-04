const express = require("express");
const request = require('request');

const db = require("../postgresQueries.js").queries;

const handleOAuthAuthenticationResponse = (req, res) => {
  request.post(
    'https://orcid.org/oauth/token',
    { form: { client_id : process.env.ORCID_OAUTH_CLIENT_ID, client_secret: process.env.ORCID_OAUTH_CLIENT_SECRET, grant_type: 'authorization_code', state: req.query.state, code: req.query.code } },
    function (error, response, body) {
        console.log(error, response, body);
    }
  );
  res.status(204).json({});
};

var router = express.Router();

router.get("", handleOAuthAuthenticationResponse);

module.exports = {
  handleOAuthAuthenticationResponse,
  router,
};