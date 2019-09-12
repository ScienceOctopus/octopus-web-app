import React, { Component } from "react";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import { withRouter } from "react-router-dom";
import graph from "../assets/images/graph.png";
import Footer from "../components/Footer";
// import ProblemSelector from "../components/ProblemSelector";

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
              &nbsp; &nbsp; &nbsp;
              <LocalizedLink
                to={WebURI.More}
                className="ui octopus-theme moar large right labeled icon button text-white"
              >
                <i className="exclamation icon" />
                About
              </LocalizedLink>
              &nbsp; &nbsp; &nbsp;
              <LocalizedLink
                to={WebURI.FAQ}
                className="ui octopus-theme moar large right labeled icon button text-white"
              >
                <i className="question icon" />
                FAQ
              </LocalizedLink>
              &nbsp; &nbsp; &nbsp;
              <a
                href={WebURI.GitHub}
                className="ui octopus-theme moar large right labeled icon button text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="github icon" />
                GitHub
              </a>
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
