exports.up = pgm => {
  pgm.createTable("userGroups", {
    id: "id",
    name: {
      type: "text",
      notNull: true,
    },
  });

  pgm.createTable("users", {
    id: "id",
    email: { type: "text", notNull: true },
    loginType: {
      type: "text",
    },
    password: {
      type: "text",
    },
    orcidKey: {
      type: "text",
    },
    displayName: {
      type: "text",
      notNull: true,
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    userGroup: {
      type: "integer",
      notNull: true,
      references: '"userGroups"',
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
      references: '"users"',
      onDelete: "cascade",
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
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
    problemID: {
      type: "integer",
      notNull: true,
      references: '"problems"',
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
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("publicationReferences", {
    id: "id",
    publicationID: {
      type: "integer",
      notNull: true,
      references: '"publications"',
      onDelete: "cascade",
    },
    referencedPublicationID: {
      type: "integer",
      notNull: true,
      references: '"publications"',
    },
  });

  pgm.createTable("publicationCollaborators", {
    id: "id",
    publication: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    user: {
      type: "integer",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    role: {
      type: "text",
      notNull: true,
    },
  });

  pgm.createTable("publicationLinks", {
    id: "id",
    publicationBefore: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    publicationAfter: {
      type: "integer",
      notNull: true,
      references: "publications",
      onDelete: "cascade",
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("resources", {
    id: "id",
    resourceType: {
      type: "text",
      notNull: true,
    },
    uri: {
      type: "text",
      notNull: true,
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("publicationResources", {
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
    behaviourType: {
      type: "text",
      notNull: true,
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};
