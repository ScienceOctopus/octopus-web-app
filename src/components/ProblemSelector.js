import React, { Component } from "react";
import SimpleSelector from "./SimpleSelector";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";

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
        <LocalizedLink to={WebURI.ProblemCreation}>
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

export default ProblemSelector;
