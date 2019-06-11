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

// Inspired by https://github.com/felixmosh/knex-on-duplicate-update
const KnexQueryBuilder = require("knex/lib/query/builder");

KnexQueryBuilder.prototype.onConflictUpdate = function(conflict, ...columns) {
  if (this._method !== "insert") {
    throw new Error(
      "onConflictUpdate error: should be used only with insert query.",
    );
  }

  if (columns.length === 0) {
    throw new Error(
      "onConflictUpdate error: please specify at least one column name.",
    );
  }

  // Dirty but effective hack
  let values = this._single.insert;

  let bindings = [];
  let placeholders = columns.map(column => {
    bindings.push(values[column]);
    return `"${column}"=?`;
  });

  let builder = this.client.raw(
    `${this.toString()} on conflict("${conflict}") do update set ${placeholders.join(
      ", ",
    )}`,
    bindings,
  );

  builder.returning = field =>
    this.client.raw(`${builder.toString()} returning "${field}"`);

  return builder;
};

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

  insertProblemStage: (problem, stage, order) =>
    knex("problem_stages")
      .insert({ problem, stage, order })
      .returning("id"),

  selectAllStagesIds: () => knex("stages").select("id"),

  selectStagesByID: id =>
    knex("stages")
      .select()
      .where("id", id),

  selectStagesByProblem: problem =>
    knex("problem_stages")
      .select()
      .where("problem", problem)
      .join("stages", "stages.id", "=", "problem_stages.stage")
      .select(),

  selectPublicationsByID: id =>
    knex("publications")
      .select()
      .where("id", id),

  selectAllPublicationsByProblem: problem =>
    knex("publications")
      .select()
      .where("problem", problem),

  selectCompletedPublicationsByProblem: problem =>
    queries.selectAllPublicationsByProblem(problem).where("draft", false),

  countCompletedPublicationsForProblem: problem =>
    queries.selectCompletedPublicationsByProblem(problem).count(),

  selectPublicationsByProblemAndCollaborator: (problem, collaborator) =>
    knex("publication_collaborators")
      .select()
      .where("publication_collaborators.user", collaborator)
      .join(
        "publications",
        "publications.id",
        "=",
        "publication_collaborators.publication",
      )
      .select()
      .where("problem", problem),

  selectPublicationsByProblemAndStage: (problem, stage) =>
    queries.selectCompletedPublicationsByProblem(problem).where("stage", stage),

  selectOriginalPublicationsByProblemAndStage: (problem, stage) =>
    queries
      .selectPublicationsByProblemAndStage(problem, stage)
      .where("review", false),

  selectOriginalDraftPublicationsByProblemAndStageAndUser: (
    problem,
    stage,
    user,
  ) =>
    queries
      .selectPublicationsByProblemAndCollaborator(problem, user)
      .where("review", false)
      .where("draft", true),

  selectPublicationsByLinksBeforePublication: publication =>
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

  selectOriginalPublicationsByLinksBeforePublication: publication =>
    queries
      .selectPublicationsByLinksBeforePublication(publication)
      .where("review", false),

  selectReviewPublicationsByPublication: publication =>
    queries
      .selectPublicationsByLinksBeforePublication(publication)
      .where("review", true),

  selectPublicationsByLinksAfterPublication: publication =>
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
  selectOriginalPublicationsByLinksAfterPublication: publication =>
    queries
      .selectPublicationsByLinksAfterPublication(publication)
      .where("review", false),

  selectReviewedPublicationsByReviewPublication: publication =>
    queries
      .selectPublicationsByLinksAfterPublication(publication)
      .where("review", true),
  selectCollaboratorsByPublication: publication =>
    knex("publication_collaborators")
      .select()
      .where("publication", publication),

  insertPublication: (
    problem,
    stage,
    title,
    summary,
    funding,
    review,
    data,
    draft,
  ) =>
    knex("publications")
      .insert({
        problem: problem,
        stage: stage,
        title: title,
        summary: summary,
        funding: funding,
        review: review,
        data: data,
        draft: draft,
      })
      .returning("id"),

  finalisePublication: publication =>
    knex("publications")
      .update({ draft: false })
      .where("id", publication),

  updatePublication: (publication, revision, title, summary, funding, data) =>
    knex("publications")
      .update({
        title: title,
        summary: summary,
        funding: funding,
        data: data,
        revision: revision + 1,
      })
      .where("id", publication)
      .where("revision", revision),

  insertPublicationCollaborator: (publication, collaborator, role) =>
    knex("publication_collaborators").insert({
      publication: publication,
      user: collaborator,
      role: role,
    }),

  selectPublicationSignoffsForRevision: (publication, revision) =>
    knex("publication_signoffs")
      .select()
      .where("publication", publication)
      .where("revision", revision),

  insertPublicationSignoff: (publication, revision, user) =>
    knex("publication_signoffs")
      .insert({
        publication: publication,
        revision: revision,
        user: user,
      })
      .returning(id),

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

  selectResourcesByPublication: publication =>
    knex("publication_resources")
      .select()
      .where("publication", publication)
      .join("resources", "resources.id", "=", "publication_resources.resource")
      .select(),

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

  selectUsers: id =>
    knex("users")
      .select()
      .where("id", id),

  selectUsersByGoblinID: orc =>
    knex("users")
      .select()
      .where("orcid", orc),

  insertOrUpdateUser: (orcid, name, primary_email) =>
    knex("users")
      .insert({
        email: primary_email,
        orcid: orcid,
        display_name: name,
        user_group: 1,
      })
      .onConflictUpdate("orcid", "display_name", "email")
      .returning("id"),
};

module.exports = {
  queries,
};
