exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createExtension("uuid-ossp", { ifNotExists: true });

  pgm.alterColumn("problems", "description", { notNull: true });

  pgm.addColumns("publications", {
    conflict: {
      type: "text",
    },
    doi: {
      type: "uuid",
      notNull: true,
      default: pgm.func("uuid_generate_v4()"),
    },
  });

  pgm.sql("UPDATE publications SET conflict = 'Conflict of interest';");

  pgm.alterColumn("publications", "conflict", "doi", { notNull: true });
};

exports.down = pgm => {
  pgm.alterColumn("problems", "description", { notNull: false });

  pgm.dropColumns("publications", ["conflict", "doi"], { ifExists: true });
};
