exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("tags", {
    id: "id",
    tag: {
      type: "string",
      notNull: true,
      unique: true,
    },
  });
  
  pgm.createTable("publication_tags", {
    id: "id",
    publication: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    tag: {
      type: "integer",
      notNull: true,
      references: "tags",
      onDelete: "cascade",
    },
  });
};

exports.down = pgm => {
  pgm.dropTable("publication_tags", {ifExists: true});
  pgm.dropTable("tags", {ifExists: true});
}
