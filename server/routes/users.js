const express = require("express");
const bodyParser = require("body-parser");

const db = require("../postgresQueries.js").queries;
const blobService = require("../blobService.js");
const upload = blobService.upload;

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  };
}

const notFound = res => {
  res.status(404).send("404 Not Found");
};

const requestInvalid = res => {
  res.status(400).send("400 Bad Request");
};

const getUserByID = async (req, res) => {
  const users = await db.selectUsers(req.params.id);

  if (!users.length) {
    return notFound(res);
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
  });
};

var router = express.Router();

router.get("/:id(\\d+)", catchAsyncErrors(getUserByID));

module.exports = {
  router,
};
