const db = require("../postgresQueries.js").queries;
const express = require("express");

const getPublicationByID = (req, res) => {
  db.selectPublicationsByID(req.params.id)
    .then(rows => {
      if (!rows.length) {
        return res.status(404);
      }

      return res.status(200).json(rows[0]);
    })
    .catch(console.error);
};

const getReferencesByPublication = (req, res) => {
  db.selectPublicationsByReferenceorPublication(req.params.id).then(rows =>
    res.status(200).json(rows),
  );
};

const getReferencedByByPublication = (req, res) => {
  db.selectPublicationsByReferencedPublication(req.params.id).then(rows =>
    res.status(200).json(rows),
  );
};

const getReviewsByPublication = (req, res) => {
  db.selectReviewPublicationsByPublication(req.params.id).then(rows =>
    res.status(200).json(rows),
  );
};

const getLinksByPublicationAfter = (req, res) => {
  db.selectOriginalPublicationsByReferenceorPublication(req.params.id).then(
    rows => res.status(200).json(rows),
  );
};

const getResourcesByPublication = (req, res) => {
  db.selectResourcesByPublication(req.params.id).then(rows =>
    res.status(200).json(rows),
  );
};

var router = express.Router();

router.get("/:id(\\d+)", getPublicationByID);
router.get("/:id(\\d+)/references", getReferencesByPublication);
router.get("/:id(\\d+)/referencedBy", getReferencedByByPublication);
router.get("/:id(\\d+)/reviews", getReviewsByPublication);
router.get("/:id(\\d+)/linksTo", getLinksByPublicationAfter);
router.get("/:id(\\d+)/resources", getResourcesByPublication);

module.exports = {
  router,
  getPublicationByID,
};
