import React from "react";
import { Link, Redirect } from "react-router-dom";
// import i18n, { AVAILABLE_LANGUAGES, SHORT_LINK_LANGS } from "../i18n";
import { AVAILABLE_LANGUAGES } from "../i18n";
import { generatePath } from "react-router-dom";

const { REACT_APP_ORCID_OAUTH_CLIENT_ID: ORCID_OAUTH_CLIENT_ID = "APP-I3S9GLKWPY01BYEA" } = process.env;

const REDIRECT_HOST = window.location.host.endsWith(":3000")
  ? "http://" + window.location.host.replace(":3000", ":3001")
  : "https://" + window.location.host;

const REDIRECT_URI = `${REDIRECT_HOST}/api/auth/orcid`;

const languageRegex = AVAILABLE_LANGUAGES.reduce((a, b) => a + "|" + b);
const LanguageMatcher = `/(${languageRegex})?`;

// const langLinkPrefix = () => {
//   if (SHORT_LINK_LANGS.includes(i18n.language)) return "";
//   else return "/" + i18n.language;
// };

export const localizeLink = link => {
  //   return langLinkPrefix() + link;
  return link;
};

export const generateLocalizedPath = (pattern, params) => {
  return localizeLink(generatePath(pattern, params));
};

export const path = generatePath;

export const RouterURI = {
  Profile: "/profile/:id(\\d+)",
  Problem: "/problems/:id(\\d+)",
  Publication: "/publications/:id(\\d+)",
  UploadToProblem: "/publish/problems/:id(\\d+)",
  UploadToProblemStage: "/publish/problems/:id(\\d+)/stages/:stage(\\d+)",
  UploadToProblemStageAll:
    "/publish/problems/:id(\\d+)/stages/:stage(\\d+)/review",
  UploadToProblemStageReview:
    "/publish/problems/:id(\\d+)/stages/:stage(\\d+)/review/:review(\\d+)",
};

export const RouterPath = link => LanguageMatcher + link;

const WebURI = {
  Home: "/",
  More: "/about",
  FAQ: "/faq",
  Explore: "/explore",
  Upload: "/publish",
  Login: "/login",
  Profile: "/profile",
  ProblemCreation: "/create",
  Search: q => (q === "" ? "/search" : `/search?q=${q}`),
  OrcidPage: orcid => `https://orcid.org/${orcid}`,
  OrcidLogin: (state, returnPath) =>
    `https://orcid.org/oauth/authorize?state=${state}&client_id=${ORCID_OAUTH_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${REDIRECT_URI}?return_path=${returnPath}`,
  Problem: "/problems",
  Publication: "/publications",
  GitHub: "https://github.com/ScienceOctopus/octopus-web-app",
};

export const LocalizedLink = props => {
  return <Link {...props} />;
};

export const LocalizedRedirect = props => {
  return <Redirect {...props} />;
};

export default WebURI;
