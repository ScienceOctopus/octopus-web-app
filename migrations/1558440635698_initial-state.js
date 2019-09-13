exports.up = pgm => {
  pgm.createTable("user_groups", {
    id: "id",
    name: {
      type: "text",
      notNull: true,
    },
  });

  pgm.createTable("users", {
    id: "id",
    email: {
      type: "text",
      notNull: true,
    },
    login_type: {
      type: "text",
    },
    password: {
      type: "text",
    },
    orcid_key: {
      type: "text",
    },
    display_name: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    user_group: {
      type: "integer",
      notNull: true,
      references: "user_groups",
      onDelete: "cascade",
    },
  });

  pgm.createTable("problems", {
    id: "id",
    title: {
      type: "text",
      notNull: true,
    },
    description: {
      type: "text",
    },
    creator: {
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
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("stages", {
    id: "id",
    name: {
      type: "text",
      notNull: true,
    },
  });

  pgm.createTable("publications", {
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
    title: {
      type: "text",
      notNull: true,
    },
    description: {
      type: "text",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("publication_references", {
    id: "id",
    publication: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    referenced_publication: {
      type: "integer",
      notNull: true,
      references: "publications",
    },
  });

  pgm.createTable("publication_collaborators", {
    id: "id",
    publication: {
      type: "integer",
      references: "publications",
      onDelete: "cascade",
    },
    user: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    role: {
      type: "text",
      notNull: true,
    },
  });

  pgm.createTable("publication_links", {
    id: "id",
    publication_before: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    publication_after: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("resources", {
    id: "id",
    resource_type: {
      type: "text",
      notNull: true,
    },
    uri: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("publication_resources", {
    id: "id",
    publication: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    resource: {
      type: "integer",
      notNull: true,
      references: "resources",
      onDelete: "cascade",
    },
    behaviour_type: {
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
  pgm.dropTable("publications", { ifExists: true });
};
