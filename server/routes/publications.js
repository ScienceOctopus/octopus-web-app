const db = require("../postgresQueries.js").queries;
const express = require("express");

const getPublicationByID = (req, res) => {
  db
    .selectPublicationsByID(req.params.id)
    .then(rows => {
       if (!rows.length) {
         return res.status(404);
       }

       return res.status(200).json(rows[0]);
    })
    .catch(console.error);
};

var router = express.Router();

router.get("/:id", getPublicationByID);

module.exports = {
  router,
  getPublicationByID,
};
