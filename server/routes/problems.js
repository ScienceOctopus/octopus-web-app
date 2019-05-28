const db = require("../postgresQueries.js").queries;
const express = require("express");

const getProblems = (req, res) => {
  db.selectAllProblems()
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const getProblemByID = (req, res) => {
  this.query
    .selectProblemsByID(req.params.id)
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const getPublicationByID = (req, res) => {
  this.query
    .selectPublicationsByID(req.params.id)
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const getPublicationsByProblem = (req, res) => {
  this.query
    .selectPublicationsByProblem(req.params.id)
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

var router = express.Router();

router.get("/api/problems", getProblems);
router.get("/api/problems/:id", getProblemByID);
router.put("/api/problems/:id/publications", getPublicationsByProblem);
router.get("/api/publications/:id", getPublicationByID);

module.exports = {
  router,
  getProblems,
  getProblemByID,
  getPublicationByID,
  getPublicationsByProblem,
};
