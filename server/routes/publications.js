const express = require("express");
const db = require("../postgresQueries").queries;
const getUserFromSession = require("../lib/userSessions").getUserFromSession;
const broadcast = require("../lib/webSocket").broadcast;

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
  console.log(`getPublications by user failed: ${req.query.user}`);
  res.status(444).end();
};

const getReviews = (req, res) => {
  if (req.query && req.query.forUser) {
    return getAllReviewsForUser(req, res);
  }

  // TODO: not done yet
  console.log(`getReviews by user failed: ${req.query.forUser}`);
  res.status(444).end();
};

const getPublicationByID = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  res.status(200).json(publication);
};

const notifyLinkedUsers = async publication => {
  let basedOn = await db
    .selectCompletedPublicationsByLinksAfterPublication(publication)
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
    console.log(`Couldn't post publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }
  if (!publication.draft) {
    return res.status(400);
  }

  const stages = await db.selectStagesByID(publication.stage);

  if (!stages.length) {
    return res.sendStatus(400);
  }

  const schema = JSON.parse(stages[0].schema);
  let data = JSON.parse(req.body.data);

  if (schema.length !== data.length) {
    console.log(`Schema-data mismatch in publication posting`);
    return res.sendStatus(400);
  }

  for (let i = 0; i < schema.length; i++) {
    let content = data[i];
    let error;

    switch (schema[i][1]) {
      case "file":
        error =
          typeof content !== "number" ||
          content <= 0 ||
          req.files[content] === undefined;
        break;
      case "uri":
        error = typeof content !== "string";
        break;
      case "text":
        error = typeof content !== "string";
        break;
      case "bool":
        error = typeof content !== "boolean";
        break;
      default:
        error = true;
    }

    if (error) {
      console.log(error);
      return res.sendStatus(400);
    }

    // TODO
    /*switch (schema[i][1]) {
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
    }*/

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

  const updatedTags = new Set(JSON.parse(req.body.tags));
  const currentTags = new Map(
    (await db.selectTagsByPublication(req.params.id, req.params.tag)).map(
      entry => [entry.tag, entry.id],
    ),
  );

  let tagsToAdd = [];
  let tagIdsToDelete = [];

  updatedTags.forEach(tag => {
    if (!currentTags.has(tag)) {
      tagsToAdd.push(tag);
    }
  });

  currentTags.forEach((id, tag) => {
    if (!updatedTags.has(tag)) {
      tagIdsToDelete.push(id);
    }
  });

  for (let i = 0; i < tagsToAdd.length; i++) {
    await db.insertTagToPublication(req.params.id, tagsToAdd[i]);
  }

  for (let i = 0; i < tagIdsToDelete.length; i++) {
    await db.deleteTagIdFromPublication(req.params.id, tagIdsToDelete[i]);
  }

  await notifyLinkedUsers(req.params.id);

  if (publication.review) {
    let reviewedPublications = await db.selectReviewedPublicationsByReviewPublication(
      publication.id,
    );

    reviewedPublications.map(reviewedPublication =>
      broadcast(`/publications/${reviewedPublication.id}/reviews`),
    );
  }

  broadcast(`/publications/${req.params.id}`);
  broadcast(`/problems/${publication.problem}/publications`);
  broadcast(
    `/problems/${publication.problem}/stages/${publication.stage}/publications`,
  );
  broadcast(`/publications/${req.params.id}/signoffs`);
  broadcast(`/publications/${req.params.id}/signoffs_remaining`);

  broadcast(`/publications/${req.params.id}/tags`);

  let allCollaborators = await db
    .selectCollaboratorsByPublication(req.params.id)
    .map(x => x.user);

  for (let i = 0; i < allCollaborators.length; i++) {
    broadcast(`/users/${allCollaborators[i]}/signoffs`);
  }

  res.sendStatus(204);
};

const getLinksBeforeByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const publications = await db.selectCompletedPublicationsByLinksAfterPublication(
    req.params.id,
  );
  res.status(200).json(publications);
};

const getAllLinksBeforeByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const resources = await db.selectCompletedPublicationsByAllLinksBeforePublication(
    req.params.id,
  );

  res.status(200).json(resources);
};

const getLinksAfterByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const publications = await db.selectCompletedPublicationsByLinksBeforePublication(
    req.params.id,
  );
  res.status(200).json(publications);
};

const getReferencesByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const references = await db.selectReferencesByPublication(req.params.id);
  res.status(200).json(references);
};

const getReviewsByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  let publications = await db.selectCompletedReviewPublicationsByPublication(
    req.params.id,
  );

  // TODO: refactor session cookie name into environmental waste
  const sessionUser = getUserFromSession(req);
  if (sessionUser) {
    const additionalPublications = await db.selectDraftReviewPublicationsByPublicationAndUser(
      req.params.id,
      sessionUser,
    );

    publications = publications.concat(additionalPublications);
  }

  res.status(200).json(publications);
};

const getResourcesByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
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
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const resources = await db.selectCollaboratorsBackwardsFromPublication(
    req.params.id,
  );
  res.status(200).json(resources);
};

const getRatingsByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const resources = await db.getRatingsByPublicationId(req.params.id);
  res.status(200).json(resources);
};

const getStageRatingsNames = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const stageNames = await db.getRatingsNamesByStageId(req.query.q);
  res.status(200).json(stageNames);
};

const getPublicationReviewRating = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const reviewRatings = await db.getPublicationReviewRating(req.params.id);
  res.status(200).json(reviewRatings);
};

const postPublicationReviewRating = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  //to do: replace args: publicationId, rating, userId
  const id = await db.insertPublicationReviewRating(
    req.body.publicationId,
    req.body.userId,
  );

  res.status(200).json(id);
};

const postCollaboratorToPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const users = await db.selectUsers(req.body.userID);
  if (!users.length) {
    console.log(`Couldn't find user with ID: ${req.body.userID}`);
    return res.sendStatus(410);
  }

  // TODO: Check that not already a collaborator

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
  broadcast(`/users/${users[0].id}/signoffs`);

  res.sendStatus(200);
};

const getSignoffsByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
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
    console.log(
      `Couldn't postSignoff for publication with ID: ${req.params.id}`,
    );
    return res.sendStatus(404);
  }

  const id = await db.insertPublicationSignoff(
    req.params.id,
    req.body.revision,
    getUserFromSession(req),
  );

  let collaborators = await db.selectCollaboratorsByPublication(req.params.id);
  const allCollaborators = collaborators.map(x => x.user);
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

    if (publication.review) {
      let reviewedPublications = await db.selectReviewedPublicationsByReviewPublication(
        publication.id,
      );

      reviewedPublications.map(reviewedPublication =>
        broadcast(`/publications/${reviewedPublication.id}/reviews`),
      );
    }

    await notifyLinkedUsers(req.params.id);

    broadcast(`/publications/${publication.id}`);
    broadcast(`/problems/${publication.problem}/publications`);
    broadcast(
      `/problems/${publication.problem}/stages/${publication.stage}/publications`,
    );
    broadcast("/problems");
    broadcast(`/problems/${publication.problem}`);
  }

  broadcast(`/publications/${req.params.id}/signoffs_remaining`);
  broadcast(`/publications/${req.params.id}/signoffs`);

  for (let i = 0; i < allCollaborators.length; i++) {
    broadcast(`/users/${allCollaborators[i]}/signoffs`);
  }

  res.sendStatus(204);
};

const getSignoffsRemainingByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
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
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
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

const getTagsByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const tags = await db.selectTagsByPublication(req.params.id, req.params.tag);

  res.status(200).json(tags);
};

const declineAuthorship = async (req, res) => {
  const removedNum = await db.deletePublicationCollaborator(
    req.params.id,
    getUserFromSession(req),
  );

  let allCollaborators = await db.selectCollaboratorsByPublication(
    req.params.id,
  );
  if (allCollaborators.length === 0) {
    await db.deletePublication(req.params.id);
  }
  const publication = await db.selectPublicationsByID(req.params.id);
  broadcast(`/publications/${req.params.id}`);
  broadcast(`/problems/${publication.problem}/publications`);
  broadcast(
    `/problems/${publication.problem}/stages/${publication.stage}/publications`,
  );
  broadcast(`/publications/${req.params.id}/signoffs_remaining`);
  broadcast(`/publications/${req.params.id}/signoffs`);
  broadcast(`/publications/${req.params.id}/collaborators`);

  for (let i = 0; i < allCollaborators.length; i++) {
    broadcast(`/users/${allCollaborators[i]}/signoffs`);
  }

  res.sendStatus(removedNum ? 204 : 404);
};

/*const postTagToPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const tag = await db.insertOrSelectTag(req.body.tag);

  await db.insertTagToPublication(req.params.id, tag);

  res.sendStatus(204);
};

const deleteTagFromPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    return res.sendStatus(404);
  }

  const tag = await db.insertOrSelectTag(req.body.tag);

  await db.deleteTagFromPublication(req.params.id, tag);

  res.sendStatus(204);
}*/

const getCollaboratorsCountByPublication = async (req, res) => {
  const publication = await getAndValidatePublication(req.params.id, req);
  if (!publication) {
    console.log(`Couldn't find publication with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const count = await db.countCollaboratorsByPublication(req.params.id);

  res
    .status(200)
    .append("X-Total-Count", count)
    .end();
};

var router = express.Router();

router.get("/", catchAsyncErrors(getPublications));
router.get("/reviews", catchAsyncErrors(getReviews));
router.get(
  "/:id(\\d+)/stage_ratings_names",
  catchAsyncErrors(getStageRatingsNames),
);
router.get("/:id(\\d+)", catchAsyncErrors(getPublicationByID));

router.post(
  "/:id(\\d+)/declineAuthorship",
  catchAsyncErrors(declineAuthorship),
);

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
  "/:id(\\d+)/publication_ratings",
  catchAsyncErrors(getRatingsByPublication),
);

router.get(
  "/:id(\\d+)/publication_review_rating",
  catchAsyncErrors(getPublicationReviewRating),
);
router.get(
  "/:id(\\d+)/collaborators",
  catchAsyncErrors(getCollaboratorsByPublication),
);

router.head(
  "/:id(\\d+)/collaborators",
  catchAsyncErrors(getCollaboratorsCountByPublication),
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
  "/:id(\\d+)/publication_review_rating",
  catchAsyncErrors(postPublicationReviewRating),
);
router.post(
  "/:id(\\d+)/request_signoff",
  catchAsyncErrors(postRequestSignoffToPublication),
);
router.get("/:id(\\d+)/tags", catchAsyncErrors(getTagsByPublication));

module.exports = {
  router,
  getPublicationByID,
};
