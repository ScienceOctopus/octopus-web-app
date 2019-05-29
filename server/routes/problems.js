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

const getStagesByProblem = (req, res) => {
  this.query
    .selectStages()
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const getPublicationsByProblemAndStage = (req, res) => {
  this.query
    .selectPublicationsByProblemAndStage(req.params.id, req.params.stage)
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const postPublicationToProblemAndStage = (req, res) => {
  this.query.insertPublication(
    req.params.problem,
    req.params.stage,
    req.query.title,
    req.query.description
  );
};

var router = express.Router();

router.get("/", getProblems);
router.get("/:id", getProblemByID);
router.get("/:id/stages", getStagesByProblem);
router.get("/:id/stages/:stage/publications", getPublicationsByProblemAndStage);
router.post(
  "/:id/stages/:stage/publications",
  postPublicationToProblemAndStage
);
//router.get("/:id/publications", getPublicationsByProblem);

module.exports = {
  router,
  getProblems,
  getProblemByID,
  getPublicationByID,
  getPublicationsByProblem,
};
