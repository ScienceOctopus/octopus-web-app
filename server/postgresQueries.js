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

const PROBLEMS_TABLE = "problems";
const USERS_TABLE = "users";
const ID = "id";

const queries = {
  allProblems: () => knex(PROBLEMS_TABLE).orderBy(ID),
};

module.exports = {
  queries,
};
