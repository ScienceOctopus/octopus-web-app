exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns("publications", {
    review: {
      type: "bool",
      default: "FALSE",
      notNull: true,
    },
    summary: {
      type: "text",
    },
  });
  pgm.alterColumn("publications", "review", { default: null });
};

exports.down = pgm => {
  pgm.dropColumns("publications", ["review", "summary"], { ifExists: true });
};
