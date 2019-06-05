import React, { Component } from "react";
import WebURI from "../urls/WebsiteURIs";
import { Link } from "react-router-dom";
import graph from "../assets/images/graph.png";

export default class IndexPage extends Component {
  render() {
    return (
      <main
        className="ui middle aligned two column centered stackable grid"
        style={styles.main}
      >
        <div className="eight wide column">
          <h1 className="ui inverted header" style={styles.heading}>
            Built for scientists
          </h1>
          <div style={styles.subtitle}>
            Octopus is a publication platform inspired by the way you research.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse,
            doloremque minus. In minima nemo accusantium iste corporis sit ut
            vero.
          </div>
          <div className="ui hidden divider" />
          <div className="ui stackable grid">
            <div className="column" style={styles.explore}>
              <Link
                to={WebURI.Upload}
                className="ui brown large right labeled icon button"
              >
                <i className="internet explorer icon" />
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
          </div>
        </div>
        <div className="four wide column computer only">
          <img
            src={graph}
            alt="Science Graph Preview"
            className="ui fluid image"
          />
        </div>

        {/* <Container height="30vh">
          <StyledGraph size={400} />
          <TitleContainer>
            <SubTitle>
              A lot of very useful information about octopus and the way it
              works
            </SubTitle>
          </TitleContainer>
        </Container> */}
      </main>
    );
  }
}

const styles = {
  main: {
    padding: "4em 0",
    backgroundColor: "teal",
  },
  heading: {
    fontSize: "5em",
    fontWeight: "normal",
  },
  subtitle: {
    color: "lightgray",
    lineHeight: "1.5em",
    fontSize: "1.4em",
  },
  explore: {
    width: "17em",
  },
  login: {
    width: "18em",
  },
};
