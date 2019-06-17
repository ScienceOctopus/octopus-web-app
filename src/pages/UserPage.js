import React, { Component } from "react";
import ProblemSearchDescription from "../components/ProblemSearchDescription";

import Api from "../api";
import { loginRequired } from "./LogInRequiredPage";
import withState from "../withState";
import PublicationSelector from "../components/PublicationSelector";
import WebURI from "../urls/WebsiteURIs";

const USER_KEY = "user";

class UserPage extends Component {
  notifications = [];
  loadingUnseenPublications = [];

  constructor(props) {
    super(props);

    this.state = {
      problems: undefined,
      finalizedPublications: [],
      finalizedReviews: [],
      draftPublications: [],
      draftReviews: [],

      unseenPublications: [],
    };
  }

  componentDidMount() {
    this.fetchUserPublications();
    this.fetchUserNotifications();
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

  fetchUserNotifications() {
    Api()
      .subscribe(USER_KEY)
      .user(global.session.user.id)
      .notifications()
      .get()
      .then(notifications => {
        this.notifications = notifications;

        if (!notifications.length) {
          this.setState({ unseenPublications: [] });
        }

        notifications.forEach(x =>
          Api()
            .publication(x.publication)
            .get()
            .then(publication => {
              this.loadingUnseenPublications.push(publication);
              if (
                this.loadingUnseenPublications.length ===
                this.notifications.length
              ) {
                this.setState({
                  unseenPublications: this.loadingUnseenPublications,
                });
                this.loadingUnseenPublications = [];
              }
            }),
        );
      });
  }

  markAllNotificationsAsSeen = () => {
    this.notifications.forEach(notif => {
      Api()
        .user(global.session.user.id)
        .notification(notif.id)
        .delete();
    });
  };

  renderLoading() {
    return null;
  }

  renderPublications(publications, name, title, zeroLengthRender) {
    if (!publications) return this.renderLoading();
    if (!publications.length) return zeroLengthRender;
    return (
      <>
        {<h2>{title}</h2>}
        <PublicationSelector
          publications={publications}
          selectionEnabled={false}
          reviewDisplay
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

  renderUnseen() {
    return this.renderWarningPublications(
      this.state.unseenPublications,
      "unseen linked",
    );
  }

  renderWarningPublications() {
    // let arr = Array(20).fill(this.state.draftPublications[0]);
    // console.log(params);
    if (!arguments[0].length) return null;

    return (
      <div className="ui segment icon warning message">
        <div className="content" style={styles.signoffContent}>
          <div style={styles.signoffHeaderContainer}>
            {/* <i className="exclamation icon" style={styles.signoffIcon} /> */}
            <div className="header">
              {"You have publications awaiting your signoff"}
            </div>
          </div>

          {this.renderPublications(...arguments)}
        </div>
      </div>
    );
  }

  shouldRenderInfo() {
    return !(
      this.state.finalizedPublications.length ||
      this.state.finalizedReviews.length ||
      this.state.draftReviews.length ||
      this.state.draftPublications.length
    );
  }

  renderInfo() {
    return (
      <div className="ui segment">
        <h1>Your publications will appear here</h1>
      </div>
    );
  }

  renderPublishedContent() {
    const draftPubs = [
      ...this.state.draftPublications,
      ...this.state.draftReviews,
    ];
    const finalPubs = [
      ...this.state.finalizedPublications,
      ...this.state.finalizedReviews,
    ];
    return (
      <>
        {finalPubs.length > 0 && (
          <div className="ui segment">
            {this.renderPublications(
              finalPubs,
              "finalized",
              "Your finalized publications",
            )}
          </div>
        )}

        {draftPubs.length > 0 && (
          <div className="ui segment">
            {this.renderPublications(
              [...this.state.draftPublications, ...this.state.draftReviews],
              "draft",
              "Your draft publications",
            )}
          </div>
        )}
      </>
    );
  }

  render() {
    return (
      <div className="ui container main">
        {this.renderTitle()}

        {this.renderUnseen()}
        {this.renderWarningPublications([], "unseen linked")}

        {this.shouldRenderInfo()
          ? this.renderInfo()
          : this.renderPublishedContent()}
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
  signoffContent: {
    maxWidth: "100%",
  },
  signoffIcon: {
    fontSize: "2em",
  },

  signoffHeaderContainer: {
    fontSize: "1.5em",
    lineHeight: "1.5em",
    marginBottom: 15,
    display: "flex",
  },
};

export default loginRequired(withState(UserPage));
