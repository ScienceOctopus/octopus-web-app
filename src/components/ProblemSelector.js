import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import SimpleSelector from "./SimpleSelector";
import Modal from "./Modal";
import ProblemSearchList from "./ProblemSearchList";
import GlobalSearch from "./GlobalSearch";
import SearchField from "./SearchField";

class ProblemSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { query: undefined, modalVisible: true };
  }

  handleSearchChange = event => {
    this.setState({
      query: event.target.value,
    });
  };

  handleSearchSubmit = event => {
    this.setState({
      submittedQuery: this.state.query,
    });

    event.preventDefault();
  };

  setModalVisible = visible => () => {
    this.setState({
      modalVisible: visible,
    });
  };

  render() {
    return (
      <div className="field container">
        {/* <SimpleSelector
          title="Select a Problem"
          style={styles.selector}
          {...this.props}
        /> */}
        <Modal
          show={this.state.modalVisible}
          onClose={this.setModalVisible(false)}
        >
          <SearchField
            placeholder="Search for problems"
            onChange={this.handleSearchChange}
            onSubmit={this.handleSearchSubmit}
            value={this.state.query}
          />
          <ProblemSearchList query={this.state.submittedQuery} />
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
