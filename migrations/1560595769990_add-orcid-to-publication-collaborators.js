exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns("publication_collaborators", {
    orcid: {
      type: "text",
      default: null,
    },
  });

  pgm.alterColumn("publication_collaborators", "user", {
    default: null,
    notNull: false,
  });
};

exports.down = pgm => {
  pgm.dropColumns("publication_collaborators", ["orcid"], { ifExists: true });
};
