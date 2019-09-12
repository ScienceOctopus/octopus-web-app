import React, { Component } from "react";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import { withRouter } from "react-router-dom";
import graph from "../assets/images/graph.png";
import Footer from "../components/Footer";
// import ProblemSelector from "../components/ProblemSelector";	
import LinkOnlyIfAcquiredState from "../components/LinkOnlyIfAcquiredState";

class IndexPage extends Component {
  render() {
    return (
      <div style={{ marginBottom: "-1rem" }}>
        <main
          className="ui middle aligned two column centered stackable octopus-theme grid inverted background"
          style={styles.main}
        >
          <div className="seven wide column">
            <h1
              id="octopus-mobile-centered-header"
              className="ui header inverted"
              style={styles.heading}
            >
              Built for scientists
            </h1>
            <h2
              id="octopus-mobile-centered-header"
              class="text-white"
              style={styles.subtitle}
            >
              Octopus is the new way to publish your scientific ideas, findings
              and research.
            </h2>
            <div class="text-white" style={styles.explanation}>
              Designed to replace journals and papers, Octopus is free to use
              and gets your work out there much more quickly, to a wider
              audience and ensures you get maximum credit for the work you do,
              whether that’s coming up with hypotheses, designing protocols,
              collecting data, doing analyses or writing reviews.
            </div>
            <div className="ui hidden divider" />
            <div className="ui grid">
              <div className="column" style={styles.explore}>
                <LocalizedLink
                  to={WebURI.Explore}
                  className="ui octopus-theme explore large right labeled icon button">
                  <i className="search icon" />
                  Explore Science
                </LocalizedLink>
              </div>
              <div className="column" style={styles.publish}>
                <LinkOnlyIfAcquiredState
                  className="ui octopus-theme publish large right labeled icon button"
                  returnPath={WebURI.Upload}>
                  <i className="ui pencil alternate icon" />
                  Publish your work
                </LinkOnlyIfAcquiredState>
              </div>
              <div className="column" style={styles.more}>
                <LocalizedLink
                  to={WebURI.More}
                  className="ui octopus-theme moar large right labeled icon button">
                  <i className="exclamation icon" />
                  Learn more
                </LocalizedLink>
              </div>
              <div className="column" style={styles.faq}>
                <LocalizedLink
                  to={WebURI.FAQ}
                  className="ui octopus-theme questionable large right labeled icon button">
                  <i className="question icon" />
                  FAQ
                </LocalizedLink>
              </div>
            </div>
          </div>
          <div className="seven wide column computer tablet only">
            <img
              src={graph}
              alt="Science Graph Preview"
              className="ui fluid image"
              style={styles.heroImage}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

const styles = {
  main: {
    padding: "2em 0",
    minHeight: "94vh",
  },
  heading: {
    fontSize: "5em",
    fontWeight: "normal",
    lineHeight: "0.9em",
  },
  subtitle: {
    fontSize: "2em",
    marginTop: 0,
  },
  explanation: {
    lineHeight: "1.5em",
    fontSize: "1.4em",
  },
  explore: {
    width: "30ch",
  },
  publish: {
    width: "32ch",
  },
  more: {
    width: "26ch",
  },
  faq: {
    width: "20ch",
  },
  heroImage: {
    minWidth: "45vw",
  },
};

export default withRouter(IndexPage);
