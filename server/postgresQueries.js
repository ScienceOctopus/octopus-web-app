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
  selectOriginalPublicationsByProblemAndStage: (problem, stage) =>
    queries
      .selectPublicationsByProblemAndStage(problem, stage)
      .where("review", false),
  selectPublicationsByReferencedPublication: publication =>
    knex("publication_links")
      .select()
      .where("publication_before", publication)
      .join(
        "publications",
        "publications.id",
        "=",
        "publication_links.publication_after",
      )
      .select(),
  selectOriginalPublicationsByReferencedPublication: publication =>
    queries
      .selectPublicationsByReferencedPublication(publication)
      .where("review", false),
  selectReviewPublicationsByPublication: publication =>
    queries
      .selectPublicationsByReferencedPublication(publication)
      .where("review", true),
  selectPublicationsByReferenceorPublication: publication =>
    knex("publication_links")
      .select()
      .where("publication_after", publication)
      .join(
        "publications",
        "publications.id",
        "=",
        "publication_links.publication_before",
      )
      .select(),
  selectOriginalPublicationsByReferenceorPublication: publication =>
    queries
      .selectPublicationsByReferenceorPublication(publication)
      .where("review", false),

  selectReviewedPublicationsByReviewPublication: publication =>
    queries
      .selectPublicationsByReferencedPublication(publication)
      .where("review", true),
  insertPublication: (problem, stage, title, summary, description, review) =>
    knex("publications")
      .insert({
        problem: problem,
        stage: stage,
        title: title,
        description: description,
        summary: summary,
        review: review,
      })
      .returning("id"),

  //TODO: actually use transactions
  insertPublicationLinkedToTransaction: (
    problem,
    stage,
    title,
    summary,
    description,
    review,
    basedOn,
    fileUrl,
  ) => {
    return knex
      .transaction(t => {
        return knex("publications")
          .transacting(t)
          .insert({
            problem: problem,
            stage: stage,
            title: title,
            description: description,
            summary: summary,
            review: review,
          })
          .returning("id")
          .then(id => {
            return knex("publication_links")
              .transacting(t)
              .insert({
                publication_before: basedOn,
                publication_after: id[0],
              })
              .returning("publication_after")
              .then(() =>
                db.insertResource("azureBlob", fileUrl).then(resources => {
                  db.insertPublicationResource(
                    id[0],
                    resources[0],
                    "main",
                  ).then(/* ... */);
                }),
              );
          })
          .then(t.commit)
          .catch(t.rollback);
      })
      .return.then(result => {
        console.log("SUCCESS");
        // transaction suceeded, data written
      })
      .catch(err => {
        console.log(err);
        // transaction failed, data rolled back
      });
  },

  insertLink: (publication, basedOn) =>
    knex("publication_links").insert(
      basedOn.map(base => ({
        publication_before: base,
        publication_after: publication,
      })),
    ),

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
  doom: () => {
    knex("user_groups").where({id: 1}).update({name: "admins"}).then(() => {
    knex("users").where({id: 1}).update({email: "admins@octopus.org", login_type: null, password: "password", display_name: "Octopus Admins"}).then(() => {
    knex("problems").where({id: 1}).update({title: "Preventing the recurrence of, and mortality in, breast cancer", description: "Preventing the recurrence of, and mortality in, breast cancer"}).then(() => {
    knex("publications").del().then(() => {
    knex("publication_references").del().then(() => {
    knex("publication_collaborators").del().then(() => {
    knex("publication_links").del().then(() => {
    knex("resources").del().then(() => {
    knex("publication_resources").del().then(() => {

    let tables = ["user_groups", "users", "problems", "stages", "publications", "publication_references", "publication_collaborators", "publication_links", "resources", "publication_resources"];

    return new Promise((resolve, reject) => it(0, {}, tables, resolve, reject));
    });});});});});});});});});
  },
};

function it(idx, acc, tables, resolve, reject) {
  if (idx >= tables.length) {
     return resolve(acc);
  }

  knex(tables[idx]).then(result => {
    acc[tables[idx]] = result;

    it(idx + 1, acc, tables, resolve, reject);
  });
}

module.exports = {
  queries,
};
