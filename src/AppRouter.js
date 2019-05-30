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
      <Route path={WebURI.Home} exact component={IndexPage} />
      <Route path={WebURI.Problem} component={ProblemPage} />
      <Route path={WebURI.Publication} component={PublicationPage} />
      <Route path={WebURI.UploadPublication} component={UploadPage} />
    </Switch>
  );
}

export default AppRouter;
