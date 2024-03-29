const express = require("express");
const request = require("request");
const cryptography = require("crypto");

const db = require("../postgresQueries").queries;
const getUserFromSession = require("../lib/userSessions").getUserFromSession;
const broadcast = require("../lib/webSocket").broadcast;

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  };
}

const getUserByID = async (req, res) => {
  const users = await db.selectUsers(req.params.id);

  if (!users.length) {
    console.log(`Couldn't find user with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  if (users.length > 1) {
    console.error("Found multiple users with same ID!");
    return res.status(500).send("500 Internal Server Error");
  }

  let user = users[0];

  // Ensure only public ORCID information can be read in the frontend
  return res.status(200).json({
    id: user.id,
    display_name: user.display_name,
    orcid: user.orcid,
  });
};

const getUserAvatar = async (req, res) => {
  const users = await db.selectUsers(req.params.id);

  if (!users.length) {
    return res.sendStatus(404);
  }

  if (users.length > 1) {
    console.error("Found multiple users with same ID!");
    return res.status(500).send("500 Internal Server Error");
  }

  // TODO: Change to use libravatar here
  let user = users[0];
  if (user.email === null) {
    res.redirect("/images/avatar.jpg");
  } else {
    let email_hash = cryptography
      .createHash("md5")
      .update(user.email)
      .digest("hex");
    req
      .pipe(
        request({
          qs: req.query,
          uri: `https://gravatar.com/avatar/${email_hash}`,
        }),
      )
      .pipe(res);
  }
};

const getNotificationsForUser = async (req, res) => {
  const notifications = await db.selectNotificationsForUser(req.params.id);

  res.status(200).json(notifications);
};

const removeUserNotification = async (req, res) => {
  const user = getUserFromSession(req);

  if (user.toString() !== req.params.id.toString()) {
    console.log(`User ID mismatch. Session: ${user.toString()}. req param: ${req.params.id}`);
    return res.sendStatus(403);
  }
  let numDeleted = await db.deleteUserNotificationByUserAndID(
    req.params.id,
    req.params.notif,
  );
  broadcast(`/users/${req.params.id}/notifications`);
  res.sendStatus(numDeleted ? 204 : 404);
};

const removeNotificationsByUserAndPublication = async (req, res) => {
  const user = getUserFromSession(req);

  let numDeleted = await db.deleteUserNotificationByUserAndPublication(
    user,
    req.query.publication,
  );

  broadcast(`/users/${req.params.id}/notifications`);
  res.sendStatus(numDeleted ? 204 : 404);
};

const removeUserNotifications = async (req, res) => {
  if (req.query && req.query.publication) {
    await removeNotificationsByUserAndPublication(req, res);
    return;
  }
};

const getAllUsers = async (req, res) => {
  if (req.query && req.query.q) {
    const users = await db.selectUsersBySearchQuery(req.query.q);

    if (users.length) {
      res.status(200).json(users);
    } else {
      res.sendStatus(404);
    }

    return;
  }

  res.sendStatus(403);
};

const getSignoffsForUser = async (req, res) => {
  const signoffs = await db.selectPublicationsAwaitingSignoffForUser(
    getUserFromSession(req),
  );

  res.status(200).json(signoffs);
};

var router = express.Router();

router.get("/", catchAsyncErrors(getAllUsers));

router.get("/:id(\\d+)", catchAsyncErrors(getUserByID));
router.get("/:id(\\d+)/signoffs", catchAsyncErrors(getSignoffsForUser));
router.get(
  "/:id(\\d+)/notifications",
  catchAsyncErrors(getNotificationsForUser),
);

router.delete(
  "/:id(\\d+)/notifications",
  catchAsyncErrors(removeUserNotifications),
);

router.delete(
  "/:id(\\d+)/notifications/:notif(\\d+)",
  catchAsyncErrors(removeUserNotification),
);
router.get("/:id(\\d+)/avatar", catchAsyncErrors(getUserAvatar));

module.exports = {
  router,
};
