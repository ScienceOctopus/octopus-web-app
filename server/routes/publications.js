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
  if (!publications.length) {
    return true;
  }

  // TODO: validate that the user requesting has viewing permissions

  return false;
};

const getPublicationByID = async (req, res) => {
  const publications = await db.selectPublicationsByID(req.params.id);
  if (!publications.length) {
    return notFound(res);
  }

  if (publications[0].draft) {
    // TODO: validate that the user requesting has viewing permissions
  }

  res.status(200).json(publications[0]);
};

const postPublicationToID = async (req, res) => {
  const publications = await db.selectPublicationsByID(req.params.id);
  if (!publications.length) {
    return notFound(res);
  }

  await db.updatePublication(
    req.params.id,
    req.body.revision,
    req.body.title,
    req.body.summary,
    req.body.funding,
    req.body.data,
  );
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

const postCollaboratorToPublication = async (req, res) => {
  if (await validatePublication(req.params.id)) {
    return notFound(res);
  }

  const id = await insertPublicationCollaborator(
    req.params.id,
    req.body.user,
    "author",
  );

  res.statusCode(200);
};

const getSignoffsByPublication = async (req, res) => {
  const publications = await db.selectPublicationsByID(req.params.id);
  if (!publications.length) {
    return notFound(res);
  }

  const signoffs = await db.selectPublicationSignoffsForRevision(
    req.params.id,
    publications[0].revision,
  );

  res.status(200).json(signoffs);
};

const postSignoffToPublication = async (req, res) => {
  const publications = await db.selectPublicationsByID(req.params.id);
  if (!publications.length) {
    return notFound(res);
  }

  // TODO: prevent duplicate signoffs being created.

  const id = await db.insertPublicationSignoff(
    req.params.id,
    req.body.revision,
    req.body.user,
  );

  res.statusCode(200);
};

const getSignoffsRemainingByPublication = async (req, res) => {
  const publications = await db.selectPublicationsByID(req.params.id);
  if (!publications.length) {
    return notFound(res);
  }

  let collaborators = await db.selectCollaboratorsByPublication(req.params.id);
  collaborators = collaborators.filter(
    collaborator => collaborator.role === "author",
  );

  const signoffs = await db.selectPublicationSignoffsForRevision(
    req.params.id,
    publications[0].revision,
  );

  collaborators = collaborators.filter(
    collaborator =>
      signoffs.filter(signoff => signoff.user !== collaborator.user).length ===
      0,
  );

  res.status(200).json(collaborators);
};

const postFinaliseToPublication = async (req, res) => {
  if (await validatePublication(req.params.id)) {
    return notFound(res);
  }

  // TODO: validate draft and correct user permissions

  // TODO: validate that the publication does has no signoffs awaiting
  await db.finalisePublication(req.params.id);
};

var router = express.Router();

router.get("/:id(\\d+)", catchAsyncErrors(getPublicationByID));
router.post("/:id(\\d+)", catchAsyncErrors(postPublicationToID));
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
router.post(
  "/:id(\\d+)/collaborators",
  catchAsyncErrors(postCollaboratorToPublication),
);
router.get("/:id(\\d+)/signoffs", catchAsyncErrors(getSignoffsByPublication));
router.post("/:id(\\d+)/signoffs", catchAsyncErrors(postSignoffToPublication));
router.get(
  "/:id(\\d+)/signoffs_remaining",
  catchAsyncErrors(getSignoffsRemainingByPublication),
);
router.post("/:id(\\d+)/finalise", catchAsyncErrors(postFinaliseToPublication));

module.exports = {
  router,
  getPublicationByID,
};
