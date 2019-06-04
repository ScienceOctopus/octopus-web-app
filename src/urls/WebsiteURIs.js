const WebURI = {
  Home: "/",

  Problem: "/problems/:id(\\d+)",
  Publication: "/publications/:id(\\d+)",

  Upload: "/upload",
  UploadToProblem: "/upload/problems/:id(\\d+)",
  UploadToProblemStage: "/upload/problems/:id(\\d+)/stages/:stage(\\d+)",
  UploadToProblemStageAll:
    "/upload/problems/:id(\\d+)/stages/:stage(\\d+)/review",
  UploadToProblemStageReview:
    "/upload/problems/:id(\\d+)/stages/:stage(\\d+)/review/:review(\\d+)",

  LoginRequest: "/login",
  LoginAuthorisation: "/login?state=:csrf-token(\\w+)"

};

export default WebURI;
