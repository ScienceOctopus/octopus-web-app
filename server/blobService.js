var azure = require("azure-storage");
var blobService = azure.createBlobService();
const multer = require("multer");
const MulterAzureStorage = require("multer-azure-storage");

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

const upload = container =>
  multer({
    storage: new MulterAzureStorage({
      azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName: container,
      containerSecurity: "blob",
    }),
  });

module.exports = {
  blobService,
  initialise,
  upload,
  AZURE_FEEDBACK_IMAGE_CONTAINER,
  AZURE_PUBLICATION_CONTAINER,
};
