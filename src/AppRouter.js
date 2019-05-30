import React from "react";
import { Switch, Route } from "react-router-dom";

import IndexPage from "./pages/IndexPage";
import ProblemPage from "./pages/ProblemPage";
import PublicationPage from "./pages/PublicationPage";
import UploadPage from "./pages/UploadPage";
import WebURI from "./urls/WebsiteURIs";

function AppRouter() {
  return (
    <Switch>
      <Route name="home" path={WebURI.Home} exact component={IndexPage} />
      <Route name="problem" path={WebURI.Problem} component={ProblemPage} />
      <Route
        name="publication"
        path={WebURI.Publication}
        component={PublicationPage}
      />
      <Route
        name="uploadPublication"
        path={WebURI.UploadPublication}
        component={UploadPage}
      />
    </Switch>
  );
}

export default AppRouter;
