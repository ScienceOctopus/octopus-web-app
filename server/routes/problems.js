const express = require("express");
const bodyParser = require("body-parser");

const db = require("../postgresQueries.js").queries;

const getProblems = (req, res) => {
  db.selectAllProblems()
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const getProblemByID = (req, res) => {
  db.selectProblemsByID(req.params.id)
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const getStagesByProblem = (req, res) => {
  db.selectStages()
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const getPublicationsByProblemAndStage = (req, res) => {
  db.selectPublicationsByProblemAndStage(req.params.id, req.params.stage)
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const postPublicationToProblemAndStage = (req, res) => {
  // TODO: validate existence of problem and stage
  db.insertPublication(
    req.params.id,
    req.params.stage,
    req.body.title,
    req.body.description
  ).then(rows => {
    console.log(rows);

    this.query.insertResource("azureBlob", "lolcats");

    this.query.insertPublicationResource("0", "0", "main");
  });
};

var router = express.Router();

router.get("/", getProblems);
router.get("/:id", getProblemByID);
router.get("/:id/stages", getStagesByProblem);
router.get("/:id/stages/:stage/publications", getPublicationsByProblemAndStage);
router.post(
  "/:id/stages/:stage/publications",
  bodyParser.urlencoded({ extended: false }),
  postPublicationToProblemAndStage
);
//router.get("/:id/publications", getPublicationsByProblem);

module.exports = {
  getProblems,
  getProblemByID,
  getStagesByProblem,
  getPublicationsByProblemAndStage,
  postPublicationToProblemAndStage,
  router,
};
