const GOBLINID_OAUTH_CLIENT_ID = "APP-3IQDM9L3ZPD3ZC36";
const REDIRECT_URI =
  "https://octopus-publishing.azurewebsites.net/api/oauth-flow";

const WebURI = {
  LanguageMatcher: "/([a-z][a-z]-[A-Z][A-Z]|[a-z][a-z])?",
  Home: "/",
  More: "/about",
  FAQ: "/faq",

  Explore: "/explore",

  Problem: "/problems/:id(\\d+)",
  Publication: "/publications/:id(\\d+)",

  Upload: "/publish",
  UploadToProblem: "/publish/problems/:id(\\d+)",
  UploadToProblemStage: "/publish/problems/:id(\\d+)/stages/:stage(\\d+)",
  UploadToProblemStageAll:
    "/publish/problems/:id(\\d+)/stages/:stage(\\d+)/review",
  UploadToProblemStageReview:
    "/publish/problems/:id(\\d+)/stages/:stage(\\d+)/review/:review(\\d+)",

  Login: "/login",

  OrcidLogin: state =>
    `https://orcid.org/oauth/authorize?state=${state}&client_id=${GOBLINID_OAUTH_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${REDIRECT_URI}`,
};

export default WebURI;
