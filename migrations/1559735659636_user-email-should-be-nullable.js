exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("users", "email", { notNull: false });
};

exports.down = (pgm) => {
  pgm.alterColumn("users", "email", { notNull: true });
};
