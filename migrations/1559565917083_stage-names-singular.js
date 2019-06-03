exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("stages", {
    singular: {
      type: "text",
      default: "",
      notNull: true,
    },
  });
  pgm.alterColumn("stages", "singular", { default: null });
};

exports.down = (pgm) => {
  pgm.dropColumns("stages", ["singular"], { ifExists: true });
};
