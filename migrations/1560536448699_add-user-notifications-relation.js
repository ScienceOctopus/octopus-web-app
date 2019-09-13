exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("user_notifications", {
    id: "id",
    user: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    publication: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
  });
};

exports.down = pgm => {
  pgm.dropTable("user_notifications", { ifExists: true });
};
