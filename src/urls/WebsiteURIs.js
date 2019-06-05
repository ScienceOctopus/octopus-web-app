const WebURI = {
  LanguageMatcher: "/([a-z][a-z]-[A-Z][A-Z]|[a-z][a-z])?",
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

  Login: "/login",
};

export default WebURI;
