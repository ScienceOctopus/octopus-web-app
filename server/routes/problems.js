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
    .then(rows => {
      if (!rows.length) {
        return res.status(404);
      }

      return res.status(200).json(rows[0]);
    })
    .catch(console.error);
};

const getStagesByProblem = (req, res) => {
  db.selectStages()
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const getPublicationsByProblemAndStage = (req, res) => {
  db.selectOriginalPublicationsByProblemAndStage(
    req.params.id,
    req.params.stage
  )
    .then(rows => res.status(200).json(rows))
    .catch(console.error);
};

const postPublicationToProblemAndStage = (req, res) => {
  // TODO: validate existence of problem and stage
  db.insertPublication(
    req.params.id,
    req.params.stage,
    req.body.title,
    req.body.description,
    req.body.summary,
    req.body.review
  ).then(publications => {
    db.insertResource("azureBlob", "lolcats").then(resources => {
      db.insertPublicationResource(publications[0], resources[0], "main").then(
        id => res.status(200).json(id[0])
      );
    });
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

module.exports = {
  getProblems,
  getProblemByID,
  getStagesByProblem,
  getPublicationsByProblemAndStage,
  postPublicationToProblemAndStage,
  router,
};
