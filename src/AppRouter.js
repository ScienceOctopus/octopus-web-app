import React from "react";
import { Route, Switch } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import FAQPage from "./pages/FAQPage";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import MorePage from "./pages/MorePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProblemPage from "./pages/ProblemPage";
import UploadPage from "./pages/UploadPage";
import WebURI, { RouterPath, RouterURI } from "./urls/WebsiteURIs";
import SearchPage from "./pages/SearchPage";
import ProblemCreationPage from "./pages/ProblemCreationPage";

function AppRouter() {
  return (
    <Switch>
      <Route
        name="home"
        path={RouterPath(WebURI.Home)}
        exact
        component={IndexPage}
      />

      <Route
        name="more"
        path={RouterPath(WebURI.More)}
        exact
        component={MorePage}
      />

      <Route
        name="faq"
        path={RouterPath(WebURI.FAQ)}
        exact
        component={FAQPage}
      />

      <Route
        name="explore"
        path={RouterPath(WebURI.Explore)}
        exact
        component={ExplorePage}
      />

      <Route
        name="problem"
        path={RouterPath(RouterURI.Problem)}
        exact
        render={props => <ProblemPage {...props} publication={false} />}
      />

      <Route
        name="publication"
        path={RouterPath(RouterURI.Publication)}
        exact
        render={props => <ProblemPage {...props} publication={true} />}
      />

      <Route
        name="upload"
        path={RouterPath(WebURI.Upload)}
        exact
        component={UploadPage}
      />

      <Route
        name="uploadToProblem"
        path={RouterPath(RouterURI.UploadToProblem)}
        exact
        render={props => <UploadPage {...props} review={false} />}
      />

      <Route
        name="uploadToProblemStage"
        path={RouterPath(RouterURI.UploadToProblemStage)}
        exact
        render={props => <UploadPage {...props} review={false} />}
      />

      <Route
        name="uploadToProblemStageAll"
        path={RouterPath(RouterURI.UploadToProblemStageAll)}
        exact
        render={props => <UploadPage {...props} review={true} />}
      />

      <Route
        name="uploadToProblemStageReview"
        path={RouterPath(RouterURI.UploadToProblemStageReview)}
        exact
        render={props => <UploadPage {...props} review={true} />}
      />

      <Route
        name="login"
        path={RouterPath(WebURI.Login)}
        exact
        component={LoginPage}
      />

      <Route
        name="search"
        path={RouterPath(WebURI.Search(""))}
        component={SearchPage}
      />

      <Route
        name="newProblem"
        path={RouterPath(WebURI.ProblemCreation)}
        component={ProblemCreationPage}
      />

      <Route name="notFound" path="/*" component={NotFoundPage} />
    </Switch>
  );
}

export default AppRouter;
