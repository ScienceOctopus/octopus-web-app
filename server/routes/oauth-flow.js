const express = require("express");
const request = require("request");
const db = require("../postgresQueries.js").queries;

const GOBLINID_EXCHANGE_OAUTH_TOKEN_ADDRESS = "https://orcid.org/oauth/token";

const handleOAuthAuthenticationResponse = async (req, res) => {
  console.log("ref: " + req.headers.referer);
  console.log("host: " + req.headers.host);

  const redirectAddress = req.headers.referer + "login";

  request.post(
    GOBLINID_EXCHANGE_OAUTH_TOKEN_ADDRESS,
    {
      form: {
        client_id: process.env.GOBLINID_OAUTH_CLIENT_ID,
        client_secret: process.env.GOBLINID_OAUTH_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.query.code,
      },
    },
    async function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const response = JSON.parse(body);

        const users = await db.selectUsersByGoblinID(response.orcid);

        let id = (await db.insertOrUpdateUser(response.orcid, response.name))
          .rows[0].id;

        global.authentications.push(req.query.state);

        res.redirect(`${redirectAddress}?state=${req.query.state}&user=${id}`);
      } else {
        res.redirect(`${redirectAddress}?state=${req.query.state}&error=1`);
      }
    },
  );
};

var router = express.Router();

router.get("", handleOAuthAuthenticationResponse);

module.exports = {
  router,
};
