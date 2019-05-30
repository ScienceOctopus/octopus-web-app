var azure = require("azure-storage");
var blobService = azure.createBlobService();

const AZURE_FEEDBACK_IMAGE_CONTAINER = "feedback-images";
const AZURE_PUBLICATION_CONTAINER = "publications";

const initialise = () => {
  blobService.createContainerIfNotExists(
    AZURE_FEEDBACK_IMAGE_CONTAINER,
    {
      publicAccessLevel: "blob",
    },
    function(error, result, response) {}
  );

  blobService.createContainerIfNotExists(
    AZURE_PUBLICATION_CONTAINER,
    {
      publicAccessLevel: "blob",
    },
    function(error, result, response) {}
  );
};

module.exports = {
  blobService,
  initialise,
  AZURE_FEEDBACK_IMAGE_CONTAINER,
  AZURE_PUBLICATION_CONTAINER,
};
