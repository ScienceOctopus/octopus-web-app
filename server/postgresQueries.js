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

  selectProblemsBySearch: searchPhrase =>
    knex("problems")
      .select()
      .whereRaw("lower(title) like ?", `%${searchPhrase.toLowerCase()}%`)
      .orWhereRaw(
        "lower(description) like ?",
        `%${searchPhrase.toLowerCase()}%`,
      ),

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

  selectPublicationsByUserId: user =>
    knex("publication_collaborators")
      .select()
      .where("publication_collaborators.user", user)
      .join(
        "publications",
        "publications.id",
        "=",
        "publication_collaborators.publication",
      ),

  selectPublicationsByProblemAndCollaborator: (problem, collaborator) =>
    queries
      .selectPublicationsByUserId(collaborator)
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
      .where("stage", stage)
      .where("review", false)
      .where("draft", true),

  selectAllPublicationsByLinksBeforePublication: publication =>
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

  selectCompletedPublicationsByLinksBeforePublication: publication =>
    queries
      .selectAllPublicationsByLinksBeforePublication(publication)
      .where("draft", false),

  selectReviewsForUser: user =>
    knex("publication_links")
      .where(
        "publication_before",
        "in",
        queries.selectPublicationsByUserId(user).select("publications.id"),
      )
      .join(
        "publications",
        "publications.id",
        "=",
        "publication_links.publication_after",
      )
      .where("review", true),

  selectNotificationsForUser: user =>
    knex("user_notifications").where("user", user),

  selectAllCollaboratorsForListOfPublications: basedOnThese =>
    knex("publication_collaborators")
      .distinct("user")
      .whereIn("publication", basedOnThese),

  insertUserNotification: (user, publication) =>
    knex("user_notifications").insert({ user, publication }),

  deleteUserNotificationByUserAndID: (user, id) =>
    knex("user_notifications")
      .where("id", id)
      .where("user", user)
      .del(),

  countCollaboratorsByPublication: publication =>
    queries.selectCollaboratorsByPublication(publication).count(),

  selectOriginalPublicationsByLinksBeforePublication: publication =>
    queries
      .selectCompletedPublicationsByLinksBeforePublication(publication)
      .where("review", false),

  selectAllReviewPublicationsByPublication: publication =>
    queries
      .selectCompletedPublicationsByLinksBeforePublication(publication)
      .where("review", true),

  selectCompletedReviewPublicationsByPublication: publication =>
    queries
      .selectAllReviewPublicationsByPublication(publication)
      .where("draft", false),

  selectReviewPublicationsByPublicationAndCollaborator: (
    publication,
    collaborator,
  ) =>
    queries
      .selectAllReviewPublicationsByPublication(publication)
      .join(
        "publication_collaborators",
        "publication_collaborators.publication",
        "=",
        "publications.id",
      )
      .select()
      .where("user", collaborator),

  selectDraftReviewPublicationsByPublicationAndUser: (publication, user) =>
    queries
      .selectReviewPublicationsByPublicationAndCollaborator(publication, user)
      .where("draft", true),

  selectAllPublicationsByLinksAfterPublication: publication =>
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

  selectCompletedPublicationsByLinksAfterPublication: publication =>
    queries
      .selectAllPublicationsByLinksAfterPublication(publication)
      .where("draft", false),

  deletePublicationCollaborator: (publication, user) =>
    knex("publication_collaborators")
      .where("publication", publication)
      .andWhere("user", user)
      .del(),

  selectOriginalPublicationsByLinksAfterPublication: publication =>
    queries
      .selectCompletedPublicationsByLinksAfterPublication(publication)
      .where("review", false),

  selectReviewedPublicationsByReviewPublication: publication =>
    queries
      .selectCompletedPublicationsByLinksAfterPublication(publication)
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
    conflict,
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
        conflict: conflict,
        review: review,
        data: data,
        draft: draft,
      })
      .returning("id"),

  finalisePublication: (publication, revision) =>
    knex("publications")
      .update({ draft: false, updated_at: new Date() })
      .where("id", publication)
      .where("revision", revision)
      .returning(["problem", "updated_at"])
      .then(([{ problem, updated_at }]) => {
        return knex("problems")
          .update({ updated_at: updated_at })
          .where("id", problem);
      }),

  updatePublicationRequestSignoff: (publication, revision) =>
    knex("publications")
      .update({ signoff_requested: true, updated_at: new Date() })
      .where("id", publication)
      .where("revision", revision),

  updatePublication: (
    publication,
    revision,
    title,
    summary,
    funding,
    conflict,
    data,
  ) =>
    knex("publications")
      .update({
        title: title,
        summary: summary,
        funding: funding,
        conflict: conflict,
        data: data,
        revision: revision + 1,
        signoff_requested: false,
        updated_at: new Date(),
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

  selectUsersByEmail: email =>
    knex("users")
      .select()
      .where("email", email),

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
  selectCollaboratorsBackwardsFromPublication: publication =>
    knex
      .withRecursive("ancestors", qb => {
        qb.select("publication_before", "publication_after")
          .from("publication_links")
          .where("publication_after", publication)
          .union(qb => {
            qb.select(
              "publication_links.publication_before",
              "publication_links.publication_after",
            )
              .from("publication_links")
              .join(
                "ancestors",
                "ancestors.publication_before",
                "publication_links.publication_after",
              );
          });
      })
      .with("ancestor_publications", qb =>
        qb
          .select("publication_before as publication")
          .from("ancestors")
          .union(qb => qb.select("publication_after").from("ancestors"))
          .union(qb =>
            qb
              .select("id")
              .from("publications")
              .where("id", publication),
          ),
      )
      .select()
      .from("ancestor_publications")
      .join(
        "publication_collaborators",
        "ancestor_publications.publication",
        "publication_collaborators.publication",
      ),

  selectAllPublicationsByAllLinksBeforePublication: publication =>
    knex
      .withRecursive("ancestors", qb => {
        qb.select("publication_before", "publication_after")
          .from("publication_links")
          .where("publication_after", publication)
          .union(qb => {
            qb.select(
              "publication_links.publication_before",
              "publication_links.publication_after",
            )
              .from("publication_links")
              .join(
                "ancestors",
                "ancestors.publication_before",
                "publication_links.publication_after",
              );
          });
      })
      .select()
      .from("ancestors")
      .join("publications", "publications.id", "ancestors.publication_before"),

  selectCompletedPublicationsByAllLinksBeforePublication: publication =>
    queries
      .selectAllPublicationsByAllLinksBeforePublication(publication)
      .where("draft", false),

  insertOrSelectTag: tag =>
    knex("tags")
      .insert({
        tag: tag,
      })
      .onConflictUpdate("tag", "tag")
      .returning("id"),
  insertTagToPublication: (publication, tag) =>
    queries.insertOrSelectTag(tag).then(res =>
      knex("publication_tags").insert({
        publication: publication,
        tag: res.rows[0].id,
      }),
    ),
  deleteTagIdFromPublication: (publication, tagId) =>
    knex("publication_tags")
      .where("publication", publication)
      .where("tag", tagId)
      .del(),
  selectTagsByPublication: publication =>
    knex("publication_tags")
      .where("publication", publication)
      .join("tags", "tags.id", "publication_tags.tag"),
};

module.exports = {
  queries,
};
