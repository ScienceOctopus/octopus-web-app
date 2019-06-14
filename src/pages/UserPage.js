import React, { Component } from "react";
import ProblemSearchDescription from "../components/ProblemSearchDescription";

import Api from "../api";
import { loginRequired } from "./LogInRequiredPage";
import withState from "../withState";
import PublicationSelector from "../components/PublicationSelector";
import WebURI from "../urls/WebsiteURIs";

const USER_KEY = "user";

class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = { problems: undefined };

    this.fetchUserPublications();
  }

  componentWillUnmount() {
    Api().unsubscribeClass(USER_KEY);
  }

  fetchUserPublications() {
    Api()
      .subscribeClass(USER_KEY, global.session.user.id)
      .publications()
      .getByUser(global.session.user.id)
      .then(publications => {
        this.setState({
          finalPubs: publications.filter(p => !p.draft),
          draftPubs: publications.filter(p => p.draft),
        });
      });
  }

  renderLoading() {
    return null;
  }

  renderPublications(publications, name) {
    if (!publications) return this.renderLoading();
    if (!publications.length) return `You have no ${name} publications yet`;
    return (
      <>
        <h2>{`${capitalizeFirst(name)} publications`}</h2>
        <PublicationSelector
          publications={publications}
          selectionEnabled={false}
        />
      </>
    );
  }

  renderTitle() {
    return (
      <h2 style={{ textAlign: "center" }}>
        User page of <strong>{global.session.user.display_name}</strong>
        {" ("}
        <a href={WebURI.OrcidPage(global.session.user.orcid)}>
          {`ORCID: ${global.session.user.orcid}`}
        </a>
        {")"}
      </h2>
    );
  }

  render() {
    return (
      <div className="ui container main">
        {this.renderTitle()}

        <div className="ui segment">
          {this.renderPublications(this.state.finalPubs, "finalized")}
        </div>

        <div className="ui segment">
          {this.renderPublications(this.state.draftPubs, "draft")}
        </div>
      </div>
    );
  }
}

const capitalizeFirst = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default loginRequired(withState(UserPage));
