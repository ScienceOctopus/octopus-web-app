exports.shorthands = undefined;

exports.up = pgm => {
  pgm.renameColumn("publication_ratings", "quality", "firstRating");
  pgm.renameColumn("publication_ratings", "sizeOfDataset", "secondRating");
  pgm.renameColumn("publication_ratings", "correctProtocol", "thirdRating");
};

exports.down = pgm => {
  pgm.dropColumns("users", ["firstRating", "secondRating", "thirdRating"]);
};
