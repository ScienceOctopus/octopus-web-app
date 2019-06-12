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
    this.state = {
      selectedProblem: undefined,
      query: undefined,
      modalVisible: false,
    };
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

  handleProblemSelect = problem => {
    this.setState({
      modalVisible: false,
    });
    if (this.props.onSelect) {
      this.props.onSelect(problem);
    }
  };

  setModalVisible = visible => () => {
    this.setState({
      modalVisible: visible,
    });
  };

  renderProblem() {
    console.log(this.props);
    const title = this.props.problems.find(
      x => x.id == this.props.selectedProblem,
    ).title;
    return <h2>{title}</h2>;
  }

  renderModal() {
    return (
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
        <ProblemSearchList
          query={this.state.submittedQuery}
          onSelect={this.handleProblemSelect}
        />
      </Modal>
    );
  }

  render() {
    return (
      <div className="field container">
        {/* <SimpleSelector
          title="Select a Problem"
          style={styles.selector}
          {...this.props}
        /> */}
        {this.props.selectedProblem &&
          this.props.problems &&
          this.renderProblem()}
        <a style={styles.link} onClick={this.setModalVisible(true)}>
          {"Search for problems"}
        </a>
        {" | "}
        <LocalizedLink
          to={{
            pathname: WebURI.ProblemCreation,
            state: { redirectOnCreation: this.props.location.pathname },
          }}
        >
          {"Create a new one"}
        </LocalizedLink>

        {this.renderModal()}
      </div>
    );
  }
}

const styles = {
  selector: {
    paddingBottom: "1rem",
  },
  link: {
    cursor: "pointer",
  },
};

export default withRouter(ProblemSelector);
