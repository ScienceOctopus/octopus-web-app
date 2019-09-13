exports.shorthands = undefined;

exports.up = pgm => {
  pgm.dropColumns("users", ["orcid"]);
  pgm.addColumns("users", { orcid: { type: "text", unique: true } });
};

exports.down = pgm => {
  pgm.dropColumns("users", ["orcid"]);
  pgm.addColumns("users", { orcid: { type: "text", unique: false } });
};
