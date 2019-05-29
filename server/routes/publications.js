const db = require("../postgresQueries.js").queries;
const express = require("express");

var router = express.Router();

router.get("/:id", getPublicationByID);

const getPublicationByID = (req, res) => {
  this.query
    .selectPublicationsByID(req.params.id)
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

module.exports = {
  router,
  getPublicationByID,
};
