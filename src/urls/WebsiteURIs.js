const WebURI = {
  Home: "/",

  Problem: "/problems/:id(\\d+)",
  Publication: "/publications/:id(\\d+)",

  Upload: "/upload",
  UploadToProblem: "/upload/problems/:id(\\d+)",
  UploadToProblemStage: "/upload/problems/:id(\\d+)/stages/:stage(\\d+)",
  UploadReview: "/upload/review/:id(\\d+)",
};

export default WebURI;
