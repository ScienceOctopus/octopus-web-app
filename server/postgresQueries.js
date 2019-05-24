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
    knex("problems").insert({
      title: title,
      description: description,
      creator: creator,
    }),
  selectPublicationsByID: id =>
    knex("publications")
      .select()
      .where("id", id),
  selectPublicationsByProblem: id =>
    knex("publications")
      .select()
      .where("problem", id),
  insertPublication: (problem, stage, title, description) =>
    knex("publications").insert({
      problem: problem,
      stage: stage,
      title: title,
      description: description,
    }),
};

module.exports = {
  queries,
};
