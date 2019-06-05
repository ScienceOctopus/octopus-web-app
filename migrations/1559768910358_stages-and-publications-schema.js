exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("stages", {
    schema: {
      type: "text",
      default: "[]",
      notNull: true,
    },
  });
  
  pgm.addColumns("publications", {
    funding: {
      type: "text",
      default: "",
      notNull: true,
    },
    data: {
      type: "text",
      default: "[]",
      notNull: true,
    },
  });
  
  pgm.dropColumns("publications", ["summary"], { ifExists: true });
  pgm.renameColumn("publications", "description", "summary");
};

exports.down = (pgm) => {
  pgm.dropColumns("stages", ["schema"], { ifExists: true });
  pgm.dropColumns("publications", ["funding", "data"], { ifExists: true });
  
  pgm.renameColumn("publications", "summary", "description");
  
  pgm.addColumns("publications", {
    summary: {
      type: "text",
    },
  });
};
