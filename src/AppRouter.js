import React from "react";
import { Switch, Route } from "react-router-dom";

import IndexPage from "./pages/IndexPage";
import MorePage from "./pages/MorePage";
import FAQPage from "./pages/FAQPage";
import ExplorePage from "./pages/ExplorePage";
import ProblemPage from "./pages/ProblemPage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import WebURI from "./urls/WebsiteURIs";

function AppRouter() {
  return (
    <Switch>
      <Route
        name="home"
        path={WebURI.LanguageMatcher + WebURI.Home}
        exact
        component={IndexPage}
      />

      <Route
        name="more"
        path={WebURI.LanguageMatcher + WebURI.More}
        exact
        component={MorePage}
      />

      <Route
        name="faq"
        path={WebURI.LanguageMatcher + WebURI.FAQ}
        exact
        component={FAQPage}
      />

      <Route
        name="explore"
        path={WebURI.LanguageMatcher + WebURI.Explore}
        exact
        component={ExplorePage}
      />

      <Route
        name="problem"
        path={WebURI.LanguageMatcher + WebURI.Problem}
        exact
        render={props => <ProblemPage {...props} publication={false} />}
      />
      <Route
        name="publication"
        path={WebURI.LanguageMatcher + WebURI.Publication}
        exact
        render={props => <ProblemPage {...props} publication={true} />}
      />

      <Route
        name="upload"
        path={WebURI.LanguageMatcher + WebURI.Upload}
        exact
        component={UploadPage}
      />
      <Route
        name="uploadToProblem"
        path={WebURI.LanguageMatcher + WebURI.UploadToProblem}
        exact
        render={props => <UploadPage {...props} review={false} />}
      />
      <Route
        name="uploadToProblemStage"
        path={WebURI.LanguageMatcher + WebURI.UploadToProblemStage}
        exact
        render={props => <UploadPage {...props} review={false} />}
      />
      <Route
        name="uploadToProblemStageAll"
        path={WebURI.LanguageMatcher + WebURI.UploadToProblemStageAll}
        exact
        render={props => <UploadPage {...props} review={true} />}
      />
      <Route
        name="uploadToProblemStageReview"
        path={WebURI.LanguageMatcher + WebURI.UploadToProblemStageReview}
        exact
        render={props => <UploadPage {...props} review={true} />}
      />

      <Route
        name="login"
        path={WebURI.LanguageMatcher + WebURI.Login}
        exact
        component={LoginPage}
      />
    </Switch>
  );
}

export default AppRouter;
