import React, { Component } from "react";
import WebURI from "../urls/WebsiteURIs";
import { Link } from "react-router-dom";
import graph from "../assets/images/graph.png";
import Footer from "../components/Footer";

export default class IndexPage extends Component {
  render() {
    return (
      <div>
        <main
          className="ui middle aligned two column centered stackable grid"
          style={styles.main}
        >
          <div className="seven wide column">
            <h1
              id="octopus-mobile-centered-header"
              className="ui inverted header"
              style={styles.heading}
            >
              Built for scientists
            </h1>
            <h2 id="octopus-mobile-centered-header" style={styles.subtitle}>
              Octopus is the new way to publish your scientific ideas, findings
              and research.
            </h2>
            <div style={styles.explanation}>
              Designed to replace journals and papers, Octopus is free to use
              and gets your work out there much more quickly, to a wider
              audience and ensures you get maximum credit for the work you do,
              whether that’s coming up with hypotheses, designing protocols,
              collecting data, doing analyses or writing reviews.
            </div>
            <div className="ui hidden divider" />
            <div className="ui grid">
              <div className="column" style={styles.explore}>
                <Link
                  to={WebURI.Explore}
                  className="ui teal large right labeled icon button"
                >
                  <i className="search icon" />
                  Explore Science
                </Link>
              </div>
              <div className="column" style={styles.login}>
                <a
                  className="ui olive large right labeled icon button"
                  href={WebURI.OrcidLogin(1337)}
                >
                  <i className="address book icon" />
                  Log In via ORCiD
                </a>
              </div>
              <div className="column" style={styles.more}>
                <Link
                  to={WebURI.More}
                  className="ui purple large right labeled icon button"
                >
                  <i className="exclamation icon" />
                  Learn more
                </Link>
              </div>
              <div className="column" style={styles.faq}>
                <Link
                  to={WebURI.FAQ}
                  className="ui violet large right labeled icon button"
                >
                  <i className="question icon" />
                  FAQ
                </Link>
              </div>
            </div>
          </div>
          <div className="seven wide column computer tablet only">
            <Link to={WebURI.Explore}>
              <img
                src={graph}
                alt="Science Graph Preview"
                className="ui fluid image"
                style={styles.heroImage}
              />
            </Link>
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
    backgroundColor: "teal",
    minHeight: "94vh",
  },
  heading: {
    fontSize: "5em",
    fontWeight: "normal",
    lineHeight: "0.9em",
  },
  subtitle: {
    color: "#fff",
    fontSize: "2em",
    marginTop: 0,
  },
  explanation: {
    color: "lightgray",
    lineHeight: "1.5em",
    fontSize: "1.4em",
  },
  explore: {
    width: "30ch",
  },
  login: {
    width: "31ch",
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
