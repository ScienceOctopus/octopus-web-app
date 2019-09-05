exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("publication_review_rating", {
    id: "id",
    publicationId: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    rating: {
      type: "integer",
      notNull: true,
      onDelete: "cascade",
    },
    userId: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable("publication_ratings", { ifExists: true });
};
