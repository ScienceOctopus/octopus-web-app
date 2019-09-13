exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("problem_stages", {
    id: "id",
    problem: {
      type: "integer",
      notNull: true,
      references: "problems",
      onDelete: "cascade",
    },
    stage: {
      type: "integer",
      notNull: true,
      references: "stages",
      onDelete: "cascade",
    },
    order: {
      type: "integer",
      notNull: true,
    },
  });

  pgm.sql(
    'INSERT INTO problem_stages (problem, stage, "order") VALUES (1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5), (1, 6, 6);',
  );
};

exports.down = pgm => {
  pgm.dropTable("problem_stages", { ifExists: true });
};
