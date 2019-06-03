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
      <Route
        name="uploadPublication"
        path={WebURI.UploadPublication}
        exact
        render={props => <UploadPage {...props} review={false} />}
      />
      <Route
        name="uploadPublicationToStage"
        path={WebURI.UploadPublicationToStage}
        exact
        render={props => <UploadPage {...props} review={false} />}
      />
      <Route
        name="uploadReview"
        path={WebURI.UploadReview}
        exact
        render={props => <UploadPage {...props} review={true} />}
      />
    </Switch>
  );
}

export default AppRouter;
