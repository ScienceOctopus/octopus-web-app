import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import WebURI, { LocalizedLink } from "../urls/WebsiteURIs";
import Modal from "./Modal";
import ProblemSearchList from "./ProblemSearchList";
import SearchField from "./SearchField";

class ProblemSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProblem: undefined,
      query: undefined,
      modalVisible: false,
      searchLoading: true,
    };
  }

  handleSearchChange = event => {
    this.setState({
      query: event.target.value,
      searchLoading: true,
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
    const title = this.props.problems.find(
      x => x.id === Number(this.props.selectedProblem),
    ).title;
    return <h1>{title}</h1>;
  }

  handleProblemsLoaded = () => {
    this.setState({ searchLoading: false });
  };

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
          loading={this.state.searchLoading}
          value={this.state.query}
        />
        <ProblemSearchList
          query={this.state.query}
          onSelect={this.handleProblemSelect}
          onLoaded={this.handleProblemsLoaded}
        />
      </Modal>
    );
  }

  render() {
    return (
      <div className="field">
        <div className="ui buttons">
          <div
            className="ui button positive"
            style={styles.link}
            onClick={this.setModalVisible(true)}
          >
            {"Look for an area of research"}
          </div>
          <div className="or" />
          <LocalizedLink to={WebURI.ProblemCreation} className="ui button">
            {"Create a new one!"}
          </LocalizedLink>
        </div>
        {this.props.selectedProblem &&
          this.props.problems &&
          this.renderProblem()}

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
