import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import SimpleSelector from "./SimpleSelector";
import Modal from "./Modal";
import ProblemSearchList from "./ProblemSearchList";
import GlobalSearch from "./GlobalSearch";

class ProblemSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="field container">
        {/* <SimpleSelector
          title="Select a Problem"
          style={styles.selector}
          {...this.props}
        /> */}
        <Modal show onClose={() => {}}>
          <GlobalSearch />
          <ProblemSearchList />
        </Modal>
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
