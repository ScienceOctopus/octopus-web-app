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

    this.state = {
      problems: undefined,
      finalizedPublications: [],
      finalizedReviews: [],
      draftPublications: [],
      draftReviews: [],
    };

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
        this.setState(splitPublications(publications));
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
        {name && <h2>{`${capitalizeFirst(name)} publications`}</h2>}
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

  renderAwaitingSignoff() {
    let arr = Array(20).fill(this.state.draftPublications[0]);

    if (!this.state.draftPublications[0]) return null;

    return (
      <div className="ui segment icon warning message">
        <i className="exclamation icon" />
        <div className="content" style={styles.signoffConent}>
          <div className="header" style={styles.signoffHeader}>
            {"You have publications awaiting your signoff"}
          </div>

          {this.renderPublications(arr)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="ui container main">
        {this.renderTitle()}

        {this.renderAwaitingSignoff()}

        <div className="ui segment">
          {this.renderPublications(
            this.state.finalizedPublications,
            "finalized",
          )}
        </div>

        <div className="ui segment">
          {this.renderPublications(this.state.draftPublications, "draft")}
        </div>
      </div>
    );
  }
}

const capitalizeFirst = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const splitPublications = pubs => {
  let splitted = {
    finalizedPublications: [],
    finalizedReviews: [],
    draftPublications: [],
    draftReviews: [],
  };

  pubs.forEach(p => {
    let key = "";
    if (p.draft) {
      key = p.review ? "draftReviews" : "draftPublications";
    } else {
      key = p.review ? "finalizedReviews" : "finalizedPublications";
    }

    splitted[key].push(p);
  });

  return splitted;
};

const styles = {
  signoffConent: { maxWidth: "95%" },
  signoffHeader: {
    marginBottom: 15,
  },
};

export default loginRequired(withState(UserPage));
