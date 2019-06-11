import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import SimpleSelector from "./SimpleSelector";

class ProblemSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="field container">
        <SimpleSelector
          title="Select a Problem"
          style={styles.selector}
          {...this.props}
        />
        {"No suitable problem? "}
        <LocalizedLink
          to={{
            pathname: WebURI.ProblemCreation,
            state: { redirectOnCreation: this.props.location.pathname },
          }}
        >
          {"Create a new one!"}
        </LocalizedLink>
      </div>
    );
  }
}

const styles = {
  selector: {
    paddingBottom: "1rem",
  },
};

export default withRouter(ProblemSelector);
