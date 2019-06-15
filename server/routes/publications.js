const db = require("../postgresQueries.js").queries;
const express = require("express");
const getUserFromSession = require("../userSessions.js").getUserFromSession;
const broadcast = require("../webSocket.js").broadcast;

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  };
}

const publicationVisibleForCurrentUser = async (publication, req) => {
  if (publication.draft) {
    const user = getUserFromSession(req);
    if (!user) {
      return false;
    }

    let collaborators = await db.selectCollaboratorsByPublication(
      publication.id,
    );
    collaborators = collaborators.filter(
      collaborator => collaborator.user === user,
    );

    if (!collaborators.length) {
      return false;
    }
  }
  return true;
};

const getAndValidatePublication = async (id, req) => {
  let publications = await db.selectPublicationsByID(id);
  if (!publications.length) {
    return undefined;
  }

  let publication = publications[0];

  return (await publicationVisibleForCurrentUser(publication, req))
    ? publication
    : undefined;
};

const getAllPublicationsByUser = async (req, res) => {
  let publications = await db.selectPublicationsByUserId(req.query.user);
  publications = publications.filter(p =>
    publicationVisibleForCurrentUser(p, req),
  );
  if (!publications.length) {
    return res.sendStatus(404);
  }

  res.status(200).json(publications);
};

const getAllReviewsForUser = async (req, res) => {
  let reviews = await db.selectReviewsForUser(req.query.forUser);
  if (!reviews.length) {
    return res.sendStatus(404);
  }

  res.status(200).json(reviews);
};

const getPublications = (req, res) => {
  if (req.query && req.query.user) {
    return getAllPublicationsByUser(req, res);
  }

  // TODO: not done yet
  res.status(444).end();
};

const getReviews = (req, res) => {
  if (req.query && req.query.forUser) {
    return getAllReviewsForUser(req, res);
  }

  // TODO: not done yet
  res.status(444).end();
};

const getPublicationByID = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  res.status(200).json(publication);
};

const notifyLinkedUsers = async publication => {
  let basedOn = await db
    .selectPublicationsByLinksAfterPublication(publication)
    .map(x => x.id);

  let usersToNotify = await db
    .selectAllCollaboratorsForListOfPublications(basedOn)
    .map(x => x.user);

  for (let i = 0; i < usersToNotify.length; i++) {
    await db.insertUserNotification(usersToNotify[i], publication);
    broadcast(`/users/${usersToNotify[i]}/notifications`);
  }
};

const postPublicationToID = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const stages = await db.selectStagesByID(publication.stage);

  if (!stages.length) {
    return res.sendStatus(400);
  }

  let data;
  const schema = JSON.parse(stages[0].schema);
  data = JSON.parse(req.body.data);

  if (schema.length !== data.length) {
    return res.sendStatus(400);
  }

  for (let i = 0; i < schema.length; i++) {
    let content = data[i];
    let error;

    switch (schema[i][1]) {
      case "file":
        error =
          typeof content != "number" ||
          content <= 0 ||
          req.files[content] === undefined;
        break;
      case "uri":
        error = typeof content != "string";
        break;
      case "text":
        error = typeof content != "string";
        break;
      case "bool":
        error = typeof content != "boolean";
        break;
      default:
        error = true;
    }

    if (error) {
      return res.sendStatus(400);
    }

    switch (schema[i][1]) {
      case "file":
        content = (await db.insertResource(
          "azureBlob",
          req.files[content].url,
        ))[0];
        resources.push(content);
        break;
      case "uri":
        content = (await db.insertResource("uri", content))[0];
        resources.push(content);
        break;
      case "text":
        break;
      case "bool":
        break;
    }

    data[i] = content;
  }

  await db.updatePublication(
    req.params.id,
    req.body.revision,
    req.body.title,
    req.body.summary,
    req.body.funding,
    req.body.conflict,
    JSON.stringify(data),
  );

  await notifyLinkedUsers(req.params.id);

  broadcast(`/publications/${req.params.id}`);
  broadcast(`/problems/${publication.problem}/publications`);
  broadcast(
    `/problems/${publication.problem}/stages/${publication.stage}/publications`,
  );
  broadcast(`/publications/${req.params.id}/signoffs`);
  broadcast(`/publications/${req.params.id}/signoffs_remaining`);

  res.sendStatus(204);
};

const getLinksBeforeByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const publications = await db.selectPublicationsByLinksAfterPublication(
    req.params.id,
  );
  res.status(200).json(publications);
};

const getAllLinksBeforeByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const resources = await db.selectPublicationsByAllLinksBeforePublication(
    req.params.id,
  );
  res.status(200).json(resources);
};

const getLinksAfterByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const publications = await db.selectPublicationsByLinksBeforePublication(
    req.params.id,
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
    req.params.id,
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
    req.params.id,
  );
  res.status(200).json(resources);
};

const postCollaboratorToPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  users = await db.selectUsersByEmail(req.body.email);
  if (!users.length) {
    return res.sendStatus(410);
  }

  const id = await db.insertPublicationCollaborator(
    req.params.id,
    users[0].id,
    "author",
  );

  broadcast(`/problems/${publication.problem}/publications`);
  broadcast(
    `/problems/${publication.problem}/stages/${publication.stage}/publications`,
  );
  broadcast(`/publications/${req.params.id}/collaborators`);
  broadcast(`/publications/${req.params.id}/allCollaborators`);
  broadcast(`/publications/${req.params.id}/signoffs_remaining`);

  res.sendStatus(200);
};

const getSignoffsByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const signoffs = await db.selectPublicationSignoffsForRevision(
    req.params.id,
    publication.revision,
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
    getUserFromSession(req),
  );

  let collaborators = await db.selectCollaboratorsByPublication(req.params.id);
  collaborators = collaborators.filter(
    collaborator => collaborator.role === "author",
  );

  const signoffs = await db.selectPublicationSignoffsForRevision(
    req.params.id,
    publication.revision,
  );

  collaborators = collaborators.filter(
    collaborator =>
      signoffs.filter(signoff => signoff.user === collaborator.user).length ===
      0,
  );

  if (collaborators.length === 0) {
    await db.finalisePublication(publication.id, publication.revision);

    await notifyLinkedUsers(req.params.id);

    broadcast(`/publications/${publication.id}`);
    broadcast(`/problems/${publication.problem}/publications`);
    broadcast(
      `/problems/${publication.problem}/stages/${
        publication.stage
      }/publications`,
    );
    broadcast("/problems");
    broadcast(`/problems/${publication.problem}`);
  }

  broadcast(`/publications/${req.params.id}/signoffs_remaining`);
  broadcast(`/publications/${req.params.id}/signoffs`);

  res.sendStatus(204);
};

const getSignoffsRemainingByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  let collaborators = await db.selectCollaboratorsByPublication(req.params.id);
  collaborators = collaborators.filter(
    collaborator => collaborator.role === "author",
  );

  const signoffs = await db.selectPublicationSignoffsForRevision(
    req.params.id,
    publication.revision,
  );

  collaborators = collaborators.filter(
    collaborator =>
      signoffs.filter(signoff => signoff.user === collaborator.user).length ===
      0,
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

  broadcast(`/publications/${req.params.id}`);
  broadcast(`/problems/${publication.problem}/publications`);
  broadcast(
    `/problems/${publication.problem}/stages/${publication.stage}/publications`,
  );

  return await postSignoffToPublication(req, res);
};

var router = express.Router();

router.get("/", catchAsyncErrors(getPublications));
router.get("/reviews", catchAsyncErrors(getReviews));

router.get("/:id(\\d+)", catchAsyncErrors(getPublicationByID));
router.post("/:id(\\d+)", catchAsyncErrors(postPublicationToID));
router.get(
  "/:id(\\d+)/linksBefore",
  catchAsyncErrors(getLinksBeforeByPublication),
);
router.get(
  "/:id(\\d+)/linksBeforeAll",
  catchAsyncErrors(getAllLinksBeforeByPublication),
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
router.get(
  "/:id(\\d+)/allCollaborators",
  catchAsyncErrors(getCollaboratorsBackwardsFromPublication),
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
router.post(
  "/:id(\\d+)/request_signoff",
  catchAsyncErrors(postRequestSignoffToPublication),
);

module.exports = {
  router,
  getPublicationByID,
};
