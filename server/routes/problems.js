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

const getProblems = async (req, res) => {
  const problems = await db.selectAllProblems();

  res.status(200).json(problems);
};

const getProblemByID = async (req, res) => {
  const problems = await db.selectProblemsByID(req.params.id);

  if (!problems.length) {
    return notFound(res);
  }

  if (problems.length > 1) {
    console.error("Found multiple problems with same ID!");
    return res.status(500).send("500 Internal Server Error");
  }

  return res.status(200).json(problems[0]);
};

const getStagesByProblem = async (req, res) => {
  const stages = await db.selectStages();
  res.status(200).json(stages);
};

const getPublicationsByProblemAndStage = async (req, res) => {
  const problems = await db.selectProblemsByID(req.params.id);
  if (!problems.length) {
    return notFound(res);
  }

  const stages = await db.selectStagesByID(req.params.stage);
  if (!stages.length) {
    return notFound(res);
  }

  const publications = await db.selectOriginalPublicationsByProblemAndStage(
    req.params.id,
    req.params.stage,
  );

  res.status(200).json(publications);
};

const postPublicationToProblemAndStage = async (req, res) => {
  const problems = await db.selectProblemsByID(req.params.id);
  if (!problems.length) {
    return requestInvalid(res);
  }

  const stages = await db.selectStagesByID(req.params.stage);
  if (!stages.length) {
    return requestInvalid(res);
  }

  const publications = await db.insertPublication(
    req.params.id,
    req.params.stage,
    req.body.title,
    req.body.summary,
    req.body.description,
    req.body.review,
  );

  if (req.body.basedOn !== undefined) {
    let basedArray = JSON.parse(req.body.basedOn);
    await db.insertLink(publications[0], basedArray);
  }

  const resources = await db.insertResource("azureBlob", req.file.url);

  await db.insertPublicationResource(publications[0], resources[0], "main");
  res.status(200).json(publications[0]);
};

var router = express.Router();

router.get("/", catchAsyncErrors(getProblems));
router.get("/:id", catchAsyncErrors(getProblemByID));
router.get("/:id(\\d+)/stages", catchAsyncErrors(getStagesByProblem));
router.get(
  "/:id(\\d+)/stages/:stage(\\d+)/publications",
  catchAsyncErrors(getPublicationsByProblemAndStage),
);

router.post(
  "/:id(\\d+)/stages/:stage(\\d+)/publications",
  upload(blobService.AZURE_PUBLICATION_CONTAINER).single("file"),
  catchAsyncErrors(postPublicationToProblemAndStage),
);

module.exports = {
  getProblems,
  getProblemByID,
  getStagesByProblem,
  getPublicationsByProblemAndStage,
  postPublicationToProblemAndStage,
  router,
};
