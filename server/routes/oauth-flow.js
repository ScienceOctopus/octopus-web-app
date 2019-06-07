const express = require("express");
const request = require("request");
const cryptography = require("crypto");
const db = require("../postgresQueries.js").queries;

const GOBLINID_EXCHANGE_OAUTH_TOKEN_ADDRESS = "https://orcid.org/oauth/token";
const SESSION_COOKIE_NAME = "Octopus API (Node.js) Session Identifier";

const handleOAuthAuthenticationResponse = (req, res) => {
  if (req.headers.cookie === undefined) {
    res.sendStatus(403);
    return;
  }

  const session = req.cookies[SESSION_COOKIE_NAME];
  if (
    global.sessions[session] === undefined ||
    global.sessions[session].state !== req.query.state
  ) {
    res.sendStatus(403);
    console.log(global.sessions);
    return;
  }

  // Don't get from Referer since an arbitrary redirect is vulnerability, according to OWASSUP?
  const redirectAddress =
    process.env.SQUID_OAUTH_COMPLETE_REDIRECT_ADDRESS + "/login";

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
        res.redirect(`${redirectAddress}?error=1`);
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
            res.redirect(`${redirectAddress}?error=1`);
            return;
          }

          const details = JSON.parse(body);
          const email =
            details.email.length >= 1 ? details.email[0].email : null;
          const users = await db.selectUsersByGoblinID(authentication.orcid);

          let id = (await db.insertOrUpdateUser(
            authentication.orcid,
            authentication.name,
            email,
          )).rows[0].id;

          global.sessions.push(req.query.state);

          res.redirect(
            `${redirectAddress}?error=0&state=${req.query.state}&redirect=${
              req.query.return_path
            }&user=${id}`,
          );
        },
      );
    },
  );
};

const handleOAuthStateRequest = (req, res) => {
  cryptography.randomBytes(128, (err, buf) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const bytes = buf.toString("hex");
    const session = bytes.slice(0, 64);
    const OAuthState = bytes.slice(64, 128);

    global.sessions[session] = { state: OAuthState, authenticated: false };
    res
      .cookie(SESSION_COOKIE_NAME, session, { httpOnly: true, path: "/" })
      .status(200)
      .json({ state: OAuthState });
  });
};

var router = express.Router();

router.get("", handleOAuthAuthenticationResponse);
router.get("/acquire-state", handleOAuthStateRequest);

module.exports = {
  router,
};
