exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns("publications", {
    dataRepository: {
      type: "text",
      default: "",
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns("publications", ["dataRepository"], {
    ifExists: true,
  });
};
