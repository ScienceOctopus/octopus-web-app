exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns("publications", {
    editorData: {
      type: "text",
      notNull: true,
      default: "",
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns("publications", ["editorData"], {
    ifExists: true,
  });
};
