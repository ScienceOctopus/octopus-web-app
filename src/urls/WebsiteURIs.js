import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LANGUAGE_LINK_KEY, AVAILABLE_LANGUAGES } from "../i18n";

const GOBLINID_OAUTH_CLIENT_ID = "APP-3IQDM9L3ZPD3ZC36";
const REDIRECT_URI =
  "https://octopus-publishing.azurewebsites.net/api/oauth-flow";

const languageRegex = AVAILABLE_LANGUAGES.reduce((a, b) => a + "|" + b);
const LanguageMatcher = `/(${languageRegex})?`;

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
  OrcidLogin: state =>
    `https://orcid.org/oauth/authorize?state=${state}&client_id=${GOBLINID_OAUTH_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${REDIRECT_URI}`,
};

export const LocalizedLink = props => {
  const { t } = useTranslation();
  console.log(t(LANGUAGE_LINK_KEY) + props.to);
  return <Link {...props} to={t(LANGUAGE_LINK_KEY) + props.to} />;
};

export default WebURI;
