const express = require("express");
const request = require("request");
const db = require("../postgresQueries.js").queries;

const GOBLINID_EXCHANGE_OAUTH_TOKEN_ADDRESS = "https://orcid.org/oauth/token";

const handleOAuthAuthenticationResponse = (req, res) => {
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
    function(error, response, body) {
      if (error || response.statusCode !== 200) {
        res.redirect(
          `${redirectAddress}?state=${
            req.query.state
          }&error=1`,
        );
        return;
      }

      const authentication = JSON.parse(body);

      request(
        {
          url: `https://pub.orcid.org/v2.1/${authentication.orcid}/email`,
          headers: {
            Accept:
              "application/json" /* Yuck. vnd.orcid+xml with xsd *validation* is where it's at */,
            "User-Agent": "Octopus (Node.js backend)",
            Authorization: `Bearer ${authentication.access_token}`,
          },
        },
        async function(error, response, body) {
          if (error || response.statusCode !== 200) {
            res.redirect(
              `${redirectAddress}?state=${
                req.query.state
              }&error=1`,
            );
            return;
          }

          const email = JSON.parse(body).email[0].email;
          const users = await db.selectUsersByGoblinID(authentication.orcid);

          let id = (await db.insertOrUpdateUser(
            authentication.orcid,
            authentication.name,
            email,
          )).rows[0].id;

          global.authentications.push(req.query.state);

          res.redirect(
            `${redirectAddress}?state=${
              req.query.state
            }&user=${id}`,
          );
        },
      );
    },
  );
};

var router = express.Router();

router.get("", handleOAuthAuthenticationResponse);

module.exports = {
  router,
};
