const autoBind = require("auto-bind");

class RequestHandlers {
  constructor(db) {
    this.query = db;

    autoBind(this);
  }

  getProblems(req, res) {
    this.query
      .selectAllProblems()
      .then(rows => res.status(200).json(rows))
      .catch(console.error);
  }

  getProblemByID(req, res) {
    this.query
      .selectProblemsByID(req.params.id)
      .then(rows => res.status(200).json(rows))
      .catch(console.error);
  }

  getPublicationByID(req, res) {
    this.query
      .selectPublicationsByID(req.params.id)
      .then(rows => res.status(200).json(rows))
      .catch(console.error);
  }

  getPublicationsByProblem(req, res) {
    this.query
      .selectPublicationsByProblem(req.params.id)
      .then(rows => res.status(200).json(rows))
      .catch(console.error);
  }
}

module.exports = db => new RequestHandlers(db);
