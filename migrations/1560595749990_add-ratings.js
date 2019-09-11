exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("ratings", {
    id: "id",
    stageId: {
      type: "integer",
      notNull: true,
      references: "stages",
    },
    firstRating: {
      type: "text",
      notNull: "true",
    },
    secondRating: {
      type: "text",
      notNull: "true",
    },
    thirdRating: {
      type: "text",
      notNull: "true",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable("ratings", { ifExists: true });
};
