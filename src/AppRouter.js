import React from "react";
import { Switch, Route } from "react-router-dom";

import IndexPage from "./pages/IndexPage";
import ProblemPage from "./pages/ProblemPage";
import UploadPage from "./pages/UploadPage";
import WebURI from "./urls/WebsiteURIs";

function AppRouter() {
  return (
    <Switch>
      <Route name="home" path={WebURI.Home} exact component={IndexPage} />

      <Route
        name="problem"
        path={WebURI.Problem}
        exact
        render={props => <ProblemPage {...props} publication={false} />}
      />
      <Route
        name="publication"
        path={WebURI.Publication}
        exact
        render={props => <ProblemPage {...props} publication={true} />}
      />

      <Route name="upload" path={WebURI.Upload} exact component={UploadPage} />
      <Route
        name="uploadToProblem"
        path={WebURI.UploadToProblem}
        exact
        render={props => <UploadPage {...props} review={false} />}
      />
      <Route
        name="uploadToProblemStage"
        path={WebURI.UploadToProblemStage}
        exact
        render={props => <UploadPage {...props} review={false} />}
      />
      <Route
        name="uploadToProblemStageAll"
        path={WebURI.UploadToProblemStageAll}
        exact
        render={props => <UploadPage {...props} review={true} />}
      />
      <Route
        name="uploadToProblemStageReview"
        path={WebURI.UploadToProblemStageReview}
        exact
        render={props => <UploadPage {...props} review={true} />}
      />
    </Switch>
  );
}

export default AppRouter;
