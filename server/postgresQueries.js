const connectionOptions = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const knex = require("knex")({
  dialect: "postgresql",
  connection: connectionOptions,
});

const queries = {
  selectAllProblems: () => knex("problems").orderBy("id"),
  selectProblemsByID: id =>
    knex("problems")
      .select()
      .where("id", id),
  insertProblem: (title, description, creator) =>
    knex("problems")
      .insert({
        title: title,
        description: description,
        creator: creator,
      })
      .returning("id"),
  selectStages: () => knex("stages").select(),
  selectPublicationsByID: id =>
    knex("publications")
      .select()
      .where("id", id),
  selectPublicationsByProblemAndStage: (problem, stage) =>
    knex("publications")
      .select()
      .where("problem", problem)
      .where("stage", stage),
  insertPublication: (problem, stage, title, description) =>
    knex("publications")
      .insert({
        problem: problem,
        stage: stage,
        title: title,
        description: description,
        review: false, // TODO: May be a review (must be linked)
      })
      .returning("id"),
  selectResource: id =>
    knex("resources")
      .select()
      .where("id", id),
  insertResource: (type, uri) =>
    knex("resources")
      .insert({
        resource_type: type,
        uri: uri,
      })
      .returning("id"),
  selectPublicationResource: id =>
    knex("publication_resources")
      .select()
      .where("id", id),
  insertPublicationResource: (publication, resource, behaviour_type) =>
    knex("publication_resources")
      .insert({
        publication: publication,
        resource: resource,
        behaviour_type: behaviour_type,
      })
      .returning("id"),
};

module.exports = {
  queries,
};
