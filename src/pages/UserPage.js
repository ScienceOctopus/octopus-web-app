import React, { Component } from "react";
// import ProblemSearchDescription from "../components/ProblemSearchDescription";

import Api from "../api";
import { loginRequired } from "./LogInRequiredPage";
import withState from "../withState";
import PublicationSelector from "../components/PublicationSelector";
import WebURI from "../urls/WebsiteURIs";
import axios from "axios";

const USER_KEY = "user";
const PROBLEM_KEY = "problem";

class UserPage extends Component {
  signoffs = [];
  loadingSignoffPublications = [];
  notifications = [];
  loadingUnseenPublications = [];

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      problems: undefined,
      finalizedPublications: [],
      finalizedReviews: [],
      draftPublications: [],
      draftReviews: [],
      signoffPublications: [],
      unseenPublications: [],
      checkingUnseen: true,
      userPublications: undefined,
      allStages: [],
      user: undefined,
    };

    this.getFullName = this.getFullName.bind(this);
  }

  componentDidMount() {
    this.fetchUserPublications();
    this.fetchUserNotifications();
    this.fetchUnsigned();
    this.fetchAllStages();
    this.fetchUser();
  }

  componentWillUnmount() {
    Api().unsubscribeClass(USER_KEY);
  }

  fetchAllStages() {
    Api()
      .problem("")
      .stages()
      .get()
      .then(allStages => this.setState({ allStages }));
  }

  fetchUserPublications() {
    Api()
      .subscribeClass(USER_KEY, global.session.user.id)
      .publications()
      .getByUser(global.session.user.id)
      .then(publications => {
        this.setState(splitPublications(publications, this.state.allStages));
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

  fetchUnsigned() {
    Api()
      .subscribe(USER_KEY)
      .user(global.session.user.id)
      .signoffs()
      .get()
      .then(signoffs => {
        this.signoffs = signoffs;
        this.setState({ checkingUnseen: false, signoffPublications: signoffs });
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

  fetchUser() {
    this.setState({ loading: true });

    Api()
      .subscribe(USER_KEY)
      .user(global.session.user.id)
      .get()
      .then(user =>
        axios
          .all([
            axios.get(`https://pub.orcid.org/v2.1/${user.orcid}/person`, {
              headers: { Accept: "application/json" },
            }),
            axios.get(`https://pub.orcid.org/v2.1/${user.orcid}/activities`, {
              headers: { Accept: "application/json" },
            }),
          ])
          .then(
            axios.spread((details, activities) =>
              this.setState({ user: { ...details.data, ...activities.data } }),
            ),
          )
          .finally(() => this.setState({ loading: false })),
      );
  }

  renderLoading() {
    return null;
  }

  renderPublicationList(publications) {
    return (
      <PublicationSelector
        publications={publications}
        selectionEnabled={false}
        reviewDisplay
      />
    );
  }

  renderPublications(publications, name, title, zeroLengthRender) {
    if (!publications) return this.renderLoading();
    if (!publications.length) return zeroLengthRender;
    return (
      <>
        <h2>{title}</h2>
        {this.renderPublicationList(publications)}
      </>
    );
  }

  renderTitle() {
    return <h2 style={styles.title}>User profile</h2>;
  }

  renderUnsigned() {
    if (this.state.checkingUnseen) return this.renderCheckingUnseen();
    if (!this.state.signoffPublications.length) return null;
    return (
      <div className="ui segment icon warning message">
        <div className="content" style={styles.signoffContent}>
          <div style={styles.signoffHeaderContainer}>
            <div className="header">
              {"You have some publications to sign "}
            </div>
          </div>

          {this.renderPublicationList(this.state.signoffPublications)}
        </div>
      </div>
    );
  }

  renderCheckingUnseen() {
    return (
      <div
        className="ui segment"
        style={{
          height: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="ui active loader" style={{ position: "unset" }} />
        <p>Checking for new publications to sign...</p>
      </div>
    );
  }

  renderUnseen() {
    if (!this.state.unseenPublications.length) return null;
    return (
      <div className="ui segment icon warning message">
        <div className="content" style={styles.signoffContent}>
          <div style={styles.signoffHeaderContainer}>
            <div className="header">{"You have new linked publications"}</div>
            <button
              className="ui button"
              onClick={this.markAllNotificationsAsSeen}
            >
              {"Mark all as seen"}
            </button>
          </div>

          {this.renderPublicationList(this.state.unseenPublications)}
        </div>
      </div>
    );
  }

  renderWarningPublications(publications) {
    // let arr = Array(20).fill(this.state.draftPublications[0]);
    // console.log(params);
    if (!arguments[0].length) return null;

    return (
      <div className="ui segment icon warning message">
        <div className="content" style={styles.signoffContent}>
          <div style={styles.signoffHeaderContainer}>
            {/* <i className="exclamation icon" style={styles.signoffIcon} /> */}
            <div className="header">{arguments[2]}</div>
          </div>

          {this.renderPublicationList(publications)}
        </div>
      </div>
    );
  }

  getRadarData() {
    const userPublications = this.state.userPublications
      ? [...this.state.userPublications]
      : [];
    let problemsCounter = this.state.problems ? this.state.problems.length : 0;

    let hypothesesCounter = 0;
    let methodsCounter = 0;
    let resultsCounter = 0;
    let analysesCounter = 0;
    let interpretationsCounter = 0;
    let applicationsCounter = 0;
    let reviewsCounter = 0;

    if (userPublications) {
      for (let i = 0; i < userPublications.length; i++) {
        if (userPublications[i].review) {
          reviewsCounter++;
          userPublications.splice(i, 1);
        }
      }
      userPublications.forEach(userPublication => {
        switch (userPublication.stage) {
          case 1:
            hypothesesCounter++;
            break;
          case 2:
            methodsCounter++;
            break;
          case 3:
            resultsCounter++;
            break;
          case 4:
            analysesCounter++;
            break;
          case 5:
            interpretationsCounter++;
            break;
          case 6:
            applicationsCounter++;
            break;
          default:
            break;
        }
      });
    }

    return [
      problemsCounter,
      hypothesesCounter,
      methodsCounter,
      resultsCounter,
      analysesCounter,
      interpretationsCounter,
      applicationsCounter,
      reviewsCounter,
    ];
  }

  // Fetch the stages, then fetch their publications
  fetchStages() {
    let done = false;

    Api()
      .subscribe(PROBLEM_KEY)
      .problem(this.state.problem)
      .stages()
      .get()
      .then(stages =>
        this.setState(this.handleStagesChange(stages), () => {
          if (!done) {
            done = true;
            this.fetchStagePublications();
          }
        }),
      );
  }

  renderPublicationRadar() {
    const radarData = this.getRadarData();
    return (
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
          </tr>
        </thead>
        <tbody>
          {radarData &&
            this.state.allStages.length > 0 &&
            this.state.allStages.map((stage, index) => (
              <tr key={index}>
                <td>{stage.name}</td>
                <td>{radarData[index]}</td>
              </tr>
            ))}
        </tbody>
      </table>
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
              draftPubs,
              "draft",
              "Your draft publications",
            )}
          </div>
        )}
      </>
    );
  }

  splitPubsByCategory(pubs) {
    if (pubs !== undefined) {
      let pubsByCategory = {};
      if (pubs && this.state.allStages.length > 0) {
        this.state.allStages.forEach(stage => (pubsByCategory[stage.id] = []));
        pubs.forEach(pub => pubsByCategory[pub.stage].push(pub));
      }
      return pubsByCategory;
    }
    return null;
  }

  renderPubsByCategory() {
    const splittedPubs = this.splitPubsByCategory(this.state.userPublications);

    if (splittedPubs) {
      return Object.keys(splittedPubs).map((pub, index) => {
        const stageKey = pub - 1;
        if (splittedPubs[pub].length > 0) {
          return (
            <div key={index} className="ui segment icon warning message">
              <div className="content" style={styles.signoffContent}>
                <div style={styles.signoffHeaderContainer}>
                  <div className="header">
                    {`${this.state.allStages[stageKey].name}(${splittedPubs[pub].length})`}
                  </div>
                </div>
                {this.renderPublicationList(splittedPubs[pub])}
              </div>
            </div>
          );
        }
      });
    }
    return null;
  }

  getFullName() {
    const { user } = this.state;
    if (
      user &&
      user.name &&
      (user.name["given-names"] || user.name["family-name"])
    ) {
      const givenName = user.name["given-names"]
        ? user.name["given-names"].value
        : "";
      const familyName = user.name["family-name"]
        ? user.name["family-name"].value
        : "";
      const display_name = `${givenName} ${familyName}`;
      console.log("display_name 11", display_name);
      return display_name;
    }
    return "";
  }

  renderUserInfo() {
    const { user, loading } = this.state;
    const fullName = this.getFullName();

    console.log("user", user);

    if (loading) {
      return (
        <div className="ui placeholder">
          <div className="paragraph">
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
      );
    }

    return (
      (user && (
        <div>
          <h3 style={{ marginBottom: 0 }}>{fullName}</h3>
          <h4 style={{ marginTop: 0 }}>
            <b>ORCID iD:</b>
            &nbsp;
            <a
              href={WebURI.OrcidPage(user.name.path)}
              target="_blank"
              style={{ fontWeight: "normal" }}
            >
              {user.name.path}
            </a>
          </h4>
        </div>
      )) ||
      null
    );
  }

  render() {
    console.log("this.state", this.state);
    console.log("this.props", this.props);

    return (
      <div className="ui container main">
        {this.renderTitle()}

        <div className="ui grid">
          <div className="eight wide left floated column">
            {this.renderUserInfo()}
          </div>
          <div
            className="eight wide right floated column"
            style={{ paddingRight: 0 }}
          >
            {this.renderPublicationRadar()}
          </div>
        </div>

        {this.renderPubsByCategory()}
        {/* {this.renderUnseen()}
        {this.renderUnsigned()}
        {this.shouldRenderInfo()
          ? this.renderInfo()
          : this.renderPublishedContent()} */}
      </div>
    );
  }
}

// const capitalizeFirst = string => {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// };

const splitPublications = (pubs, stages) => {
  let splitted = {
    userPublications: pubs,
    finalizedPublications: [],
    finalizedReviews: [],
    draftPublications: [],
    draftReviews: [],
  };
  let pubsByCategory = {};
  if (pubs && stages.length > 0) {
    stages.forEach(stage => (pubsByCategory[stage.id] = []));
    pubs.forEach(pub => pubsByCategory[pub.stage].push(pub));
  }
  pubs.forEach(p => {
    let key = "";
    if (p.draft) {
      key = p.review ? "draftReviews" : "draftPublications";
    } else {
      key = p.review ? "finalizedReviews" : "finalizedPublications";
    }

    // switch(p.stage)

    splitted[key].push(p);
  });

  return splitted;
};

const styles = {
  title: {
    marginBottom: 20,
  },
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
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export default loginRequired(withState(UserPage));
