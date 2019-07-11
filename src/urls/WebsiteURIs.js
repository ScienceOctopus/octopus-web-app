import React from "react";
import { Link, Redirect } from "react-router-dom";
import i18n, { AVAILABLE_LANGUAGES, SHORT_LINK_LANGS } from "../i18n";
import { generatePath } from "react-router-dom";

const ORCID_OAUTH_CLIENT_ID = "APP-3IQDM9L3ZPD3ZC36";

const REDIRECT_HOST = window.location.host.endsWith(":3000")
  ? "http://" + window.location.host.slice(0, -1) + "1"
  : "https://" + window.location.host;

const REDIRECT_URI = `${REDIRECT_HOST}/api/oauth-flow`;

const languageRegex = AVAILABLE_LANGUAGES.reduce((a, b) => a + "|" + b);
const LanguageMatcher = `/(${languageRegex})?`;

const langLinkPrefix = () => {
  if (SHORT_LINK_LANGS.includes(i18n.language)) return "";
  else return "/" + i18n.language;
};

export const localizeLink = link => {
  //   return langLinkPrefix() + link;
  return link;
};

export const generateLocalizedPath = (pattern, params) => {
  return localizeLink(generatePath(pattern, params));
};

export const path = generatePath;

export const RouterURI = {
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
};

export const LocalizedLink = props => {
  return <Link {...props} />;
};

export const LocalizedRedirect = props => {
  return <Redirect {...props} />;
};

export default WebURI;
