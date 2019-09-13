exports.shorthands = undefined;

exports.up = pgm => {
  pgm.dropColumns("users", ["password", "login_type"]);
  pgm.renameColumn("users", "orcid_key", "orcid");
};

exports.down = pgm => {
  pgm.addColumns("user", {
    login_type: {
      type: "text",
    },
    password: {
      type: "text",
    },
  });
  pgm.renameColumn("users", "orcid", "orcid_key");
};
