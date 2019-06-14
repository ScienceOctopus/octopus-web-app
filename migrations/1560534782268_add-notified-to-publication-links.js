exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns("publication_links", {
    notified: {
      type: "boolean",
      default: "false",
      notNull: "true",
    },
  });
};
