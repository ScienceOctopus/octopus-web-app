const express = require("express");
const request = require("request");
const cryptography = require("crypto");
const db = require("../postgresQueries.js").queries;

const SESSION_COOKIE_NAME = require("../userSessions").SESSION_COOKIE_NAME;

const ORCID_EXCHANGE_OAUTH_TOKEN_ADDRESS = "https://orcid.org/oauth/token";

const handleOAuthAuthenticationResponse = (req, res) => {
  if (req.headers.cookie === undefined) {
    res.sendStatus(403);
    return;
  }

  const session = req.cookies[SESSION_COOKIE_NAME];
  if (
    global.sessions[session] === undefined ||
    global.sessions[session].OAuthState !== req.query.state
  ) {
    res.sendStatus(403);
    return;
  }

  // Don't get from Referer since an arbitrary redirect is vulnerability, according to OWASSUP?
  const redirectAddress =
    process.env.SQUID_OAUTH_COMPLETE_REDIRECT_ADDRESS + "/login";

  request.post(
    ORCID_EXCHANGE_OAUTH_TOKEN_ADDRESS,
    {
      form: {
        client_id: process.env.ORCID_OAUTH_CLIENT_ID,
        client_secret: process.env.ORCID_OAUTH_CLIENT_SECRET,
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
          const users = await db.selectUsersByOrcID(authentication.orcid);

          let id = (await db.insertOrUpdateUser(
            authentication.orcid,
            authentication.name,
            email,
          )).rows[0].id;

          global.sessions[session].user = id;

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

const handleOAuthStateRequest = async (req, res) => {
  if (req.headers.cookie !== undefined) {
    const session = req.cookies[SESSION_COOKIE_NAME];
    const data = global.sessions[session];
    if (data !== undefined) {
      if (data.user === undefined) {
        res.status(200).json({ OAuthState: data.OAuthState });
      } else {
        const user = (await db.selectUsers(data.user))[0];
        res.status(200).json({ OAuthState: data.OAuthState, user: user });
      }
      return;
    }
  }

  cryptography.randomBytes(128, (err, buf) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const bytes = buf.toString("hex");
    const session = bytes.slice(0, 64);
    const OAuthState = bytes.slice(64, 128);

    global.sessions[session] = { OAuthState: OAuthState, user: undefined };
    res
      .cookie(SESSION_COOKIE_NAME, session, { httpOnly: true, path: "/" })
      .status(200)
      .json({ OAuthState: OAuthState });
  });
};

const handleOAuthStateDiscardRequest = async (req, res) => {
  // TODO discard on server as well?
  res
    .clearCookie(SESSION_COOKIE_NAME, { httpOnly: true, path: "/" })
    .sendStatus(204);
};

var router = express.Router();

router.get("", handleOAuthAuthenticationResponse);
router.get("/acquire-state", handleOAuthStateRequest);
router.get("/discard-state", handleOAuthStateDiscardRequest);

module.exports = {
  router,
};
