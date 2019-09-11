exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("publication_ratings", {
    id: "id",
    publicationId: {
      type: "integer",
      notNull: true,
      references: "publications",
    },
    quality: {
      type: "integer",
      notNull: true,
      onDelete: "cascade",
    },
    sizeOfDataset: {
      type: "integer",
      notNull: true,
      onDelete: "cascade",
    },
    correctProtocol: {
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
