exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns("publications", {
    draft: {
      type: "boolean",
      default: false,
      notNull: true,
    },
    revision: {
      type: "integer",
      default: 1,
      notNull: true,
    },
    signoff_requested: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
  pgm.alterColumn("publications", "draft", { default: null });

  pgm.createTable("publication_signoffs", {
    id: "id",
    publication: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    revision: {
      type: "integer",
      notNull: true,
    },
    user: {
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

  pgm.createTable("publication_invitations", {
    id: "id",
    publication: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    email: {
      type: "text",
      notNull: true,
    },
    invitation_role: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns("publications", ["drafts", "revision"], { ifExists: true });
  pgm.dropTable("publication_invitations", { ifExists: true });
  pgm.dropTable("publication_signoffs", { ifExists: true });
};
