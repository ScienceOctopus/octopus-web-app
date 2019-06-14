exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("user_notifications", {
    id: "id",
    usee: {
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
    notified: {
      type: "boolean",
      default: false,
      notNull: true,
    },
  });
};
