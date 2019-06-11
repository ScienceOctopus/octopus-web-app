exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("problems", "description", { notNull: true });
  
  pgm.addColumns("publications", {
    conflict: {
      type: "text",
    },
  });
  
  pgm.sql("UPDATE publications SET conflict = 'Conflict of interest';");
  
  pgm.alterColumn("publications", "conflict", { notNull: true });
};

exports.down = (pgm) => {
  pgm.alterColumn("problems", "description", { notNull: false });
  
  pgm.dropColumns("publications", ["conflict"], { ifExists: true });
};
