exports.shorthands = undefined;

exports.up = pgm => {
  pgm.alterColumn("users", "orcid", { notNull: true });
};

exports.down = pgm => {
  pgm.alterColumn("users", "orcid", { notNull: false });
};
Sorry for delay, I didn't expect some tasks to take that long.
