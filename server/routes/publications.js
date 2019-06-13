const db = require("../postgresQueries.js").queries;
const express = require("express");
const getUserFromSession = require("../userSessions.js").getUserFromSession;

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  };
}

const getAndValidatePublication = async (id, req) => {
  let publications = await db.selectPublicationsByID(id);
  if (!publications.length) {
    return undefined;
  }

  let publication = publications[0];

  // Validate that the user is a collaborator of the publication if it is a draft.
  if (publication.draft) {
    const user = getUserFromSession(req);
    if (!user) {
      return undefined;
    }

    let collaborators = await db.selectCollaboratorsByPublication(id);
    collaborators = collaborators.filter(
      collaborator => collaborator.user === user
    );
    if (!collaborators.length) {
      return undefined;
    }
  }

  return publication;
};

const getPublicationByID = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  res.status(200).json(publication);
};

const postPublicationToID = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  await db.updatePublication(
    req.params.id,
    req.body.revision,
    req.body.title,
    req.body.summary,
    req.body.funding,
    req.body.data
  );
};

const getLinksBeforeByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const publications = await db.selectPublicationsByLinksAfterPublication(
    req.params.id
  );
  res.status(200).json(publications);
};

const getAllLinksBeforeByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const resources = await db.selectPublicationsByAllLinksBeforePublication(
    req.params.id
  );
  res.status(200).json(resources);
};

const getLinksAfterByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const publications = await db.selectPublicationsByLinksBeforePublication(
    req.params.id
  );
  res.status(200).json(publications);
};

const getReferencesByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const references = await db.selectReferencesByPublication(req.params.id);
  res.status(200).json(references);
};

const getReviewsByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const publications = await db.selectReviewPublicationsByPublication(
    req.params.id
  );
  res.status(200).json(publications);
};

const getResourcesByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const resources = await db.selectResourcesByPublication(req.params.id);
  res.status(200).json(resources);
};

const getCollaboratorsByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const resources = await db.selectCollaboratorsByPublication(req.params.id);
  res.status(200).json(resources);
};

const getCollaboratorsBackwardsFromPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const resources = await db.selectCollaboratorsBackwardsFromPublication(
    req.params.id
  );
  res.status(200).json(resources);
};

const postCollaboratorToPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const id = await insertPublicationCollaborator(
    req.params.id,
    req.body.user,
    "author"
  );

  res.sendStatus(200);
};

const getSignoffsByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const signoffs = await db.selectPublicationSignoffsForRevision(
    req.params.id,
    publication.revision
  );

  res.status(200).json(signoffs);
};

const postSignoffToPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const id = await db.insertPublicationSignoff(
    req.params.id,
    req.body.revision,
    getUserFromSession(req)
  );

  let collaborators = await db.selectCollaboratorsByPublication(req.params.id);
  collaborators = collaborators.filter(
    collaborator => collaborator.role === "author"
  );

  const signoffs = await db.selectPublicationSignoffsForRevision(
    req.params.id,
    publication.revision
  );

  collaborators = collaborators.filter(
    collaborator =>
      signoffs.filter(signoff => signoff.user === collaborator.user).length ===
      0
  );

  if (collaborators.length === 0) {
    await db.finalisePublication(publication.id, publication.revision);
  }

  res.sendStatus(204);
};

const getSignoffsRemainingByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  let collaborators = await db.selectCollaboratorsByPublication(req.params.id);
  collaborators = collaborators.filter(
    collaborator => collaborator.role === "author"
  );

  const signoffs = await db.selectPublicationSignoffsForRevision(
    req.params.id,
    publication.revision
  );

  collaborators = collaborators.filter(
    collaborator =>
      signoffs.filter(signoff => signoff.user === collaborator.user).length ===
      0
  );

  res.status(200).json(collaborators);
};

const postRequestSignoffToPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  // TODO: validate that the publication has no signoffs awaiting
  await db.updatePublicationRequestSignoff(req.params.id, req.body.revision);

  return await postSignoffToPublication(req, res);
};

var router = express.Router();

router.get("/:id(\\d+)", catchAsyncErrors(getPublicationByID));
router.post("/:id(\\d+)", catchAsyncErrors(postPublicationToID));
router.get(
  "/:id(\\d+)/linksBefore",
  catchAsyncErrors(getLinksBeforeByPublication)
);
router.get(
  "/:id(\\d+)/linksBeforeAll",
  catchAsyncErrors(getAllLinksBeforeByPublication)
);
router.get(
  "/:id(\\d+)/linksAfter",
  catchAsyncErrors(getLinksAfterByPublication)
);
router.get(
  "/:id(\\d+)/references",
  catchAsyncErrors(getReferencesByPublication)
);
//router.get("/:id(\\d+)/referencedBy", catchAsyncErrors(getReferencedByByPublication));
router.get("/:id(\\d+)/reviews", catchAsyncErrors(getReviewsByPublication));
router.get("/:id(\\d+)/resources", catchAsyncErrors(getResourcesByPublication));
router.get(
  "/:id(\\d+)/collaborators",
  catchAsyncErrors(getCollaboratorsByPublication)
);
router.get(
  "/:id(\\d+)/allCollaborators",
  catchAsyncErrors(getCollaboratorsBackwardsFromPublication)
);
router.post(
  "/:id(\\d+)/collaborators",
  catchAsyncErrors(postCollaboratorToPublication)
);
router.get("/:id(\\d+)/signoffs", catchAsyncErrors(getSignoffsByPublication));
router.post("/:id(\\d+)/signoffs", catchAsyncErrors(postSignoffToPublication));
router.get(
  "/:id(\\d+)/signoffs_remaining",
  catchAsyncErrors(getSignoffsRemainingByPublication)
);
router.post(
  "/:id(\\d+)/request_signoff",
  catchAsyncErrors(postRequestSignoffToPublication)
);

module.exports = {
  router,
  getPublicationByID,
};
