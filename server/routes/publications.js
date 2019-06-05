const db = require("../postgresQueries.js").queries;
const express = require("express");

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

const validatePublication = async id => {
  let publications = await db.selectPublicationsByID(id);
  return !publications.length;
};

const getPublicationByID = async (req, res) => {
  const publications = await db.selectPublicationsByID(req.params.id);
  if (!publications.length) {
    return notFound(res);
  }

  res.status(200).json(publications[0]);
};

const getLinksBeforeByPublication = async (req, res) => {
  if (await validatePublication(req.params.id)) {
    return notFound(res);
  }

  const publications = await db.selectPublicationsByLinksAfterPublication(
    req.params.id,
  );
  res.status(200).json(publications);
};

const getLinksAfterByPublication = async (req, res) => {
  if (await validatePublication(req.params.id)) {
    return notFound(res);
  }

  const publications = await db.selectPublicationsByLinksBeforePublication(
    req.params.id,
  );
  res.status(200).json(publications);
};

const getReferencesByPublication = async (req, res) => {
  if (await validatePublication(req.params.id)) {
    return notFound(res);
  }

  const references = await db.selectReferencesByPublication(req.params.id);
  res.status(200).json(references);
};

const getReviewsByPublication = async (req, res) => {
  if (await validatePublication(req.params.id)) {
    return notFound(res);
  }

  const publications = await db.selectReviewPublicationsByPublication(
    req.params.id,
  );
  res.status(200).json(publications);
};

const getResourcesByPublication = async (req, res) => {
  if (await validatePublication(req.params.id)) {
    return notFound(res);
  }

  const resources = await db.selectResourcesByPublication(req.params.id);
  res.status(200).json(resources);
};

const getCollaboratorsByPublication = async (req, res) => {
  if (await validatePublication(req.params.id)) {
    return notFound(res);
  }

  const resources = await db.selectCollaboratorsByPublication(req.params.id);
  res.status(200).json(resources);
};

var router = express.Router();

router.get("/:id(\\d+)", catchAsyncErrors(getPublicationByID));
router.get(
  "/:id(\\d+)/linksBefore",
  catchAsyncErrors(getLinksBeforeByPublication),
);
router.get(
  "/:id(\\d+)/linksAfter",
  catchAsyncErrors(getLinksAfterByPublication),
);
router.get(
  "/:id(\\d+)/references",
  catchAsyncErrors(getReferencesByPublication),
);
//router.get("/:id(\\d+)/referencedBy", catchAsyncErrors(getReferencedByByPublication));
router.get("/:id(\\d+)/reviews", catchAsyncErrors(getReviewsByPublication));
router.get("/:id(\\d+)/resources", catchAsyncErrors(getResourcesByPublication));
router.get(
  "/:id(\\d+)/collaborators",
  catchAsyncErrors(getCollaboratorsByPublication),
);

module.exports = {
  router,
  getPublicationByID,
};
