const query = require("./postgresQueries").queries;

const getProblems = (req, res) => {
  query
    .selectAllProblems()
    .then(console.log)
    .catch(console.error);
};

const getProblemByID = (req, res) => {
  query
    .selectProblemsByID(req.params.id)
    .then(res.status(200).json)
    .catch(console.error);
};

const getPublicationByID = (req, res) => {
  query
    .selectPublicationsByID(req.params.id)
    .then(res.status(200).json)
    .catch(console.error);
};

const getPublicationsByProblem = (req, res) => {
  query
    .selectPublicationsByProblem(req.params.id)
    .then(res.status(200).json)
    .catch(console.error);
};
// const getUsers = (request, response) => {
//   pool.query("SELECT * FROM users ORDER BY id ASC", (error, result) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(result.rows);
//   });
// };

// const getUserByName = (request, response) => {
//   const name = request.query.name;

//   pool.query("SELECT * FROM users WHERE name = $1", [name], (error, result) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(result.rows);
//   });
// };

// const createUser = (request, response) => {
//   const { name, email } = request.body;

//   pool.query(
//     "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
//     [name, email],
//     (error, result) => {
//       if (error) {
//         throw error;
//       }
//       response.status(201).send(`User added with ID: ${result.rows[0].id}`);
//     }
//   );
// };

// const updateUser = (request, response) => {
//   const id = parseInt(request.params.id);
//   const { name, email } = request.body;

//   pool.query(
//     "UPDATE users SET name = $1, email = $2 WHERE id = $3",
//     [name, email, id],
//     (error, result) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).send(`User modified with ID: ${id}`);
//     }
//   );
// };

// const deleteUser = (request, response) => {
//   const id = parseInt(request.params.id);

//   pool.query("DELETE FROM users WHERE id = $1", [id], (error, result) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).send(`User deleted with ID: ${id}`);
//   });
// };

module.exports = {
  getProblems,
  getProblemByID,
  getPublicationByID,
  getPublicationsByProblem,
};
