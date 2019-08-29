import React, { Component } from "react";
// import PublicationLinkingTemplate from "./PublicationLinkingTemplate";
import PublicationSearchList from "./PublicationSearchList";
import SearchField from "../SearchField";

class PublicationThirdStep extends Component {
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

  render() {
    if (!this.props.previousStageData)
      return <h4 style={styles.subtitle}> Please submit the publication!</h4>;
    console.log("third step state", this.state);
    return (
      <div>
        <h4 style={styles.subtitle}>
          Which {this.props.previousStageData.name} publication is this{" "}
          {this.props.stageName} linked to?
        </h4>
        <hr />
        <br />
        <SearchField
          placeholder={`Search for ${this.props.previousStageData.name}`}
          onChange={this.handleSearchChange}
          onSubmit={this.handleSearchSubmit}
          loading={this.state.searchLoading}
          value={this.state.query}
        />
        <PublicationSearchList
          query={this.state.query}
          onSelect={this.handleProblemSelect}
          publications={this.props.previousStageData.publications}
        />
      </div>
    );
  }
}

const styles = {
  subtitle: {
    marginTop: 20,
    marginBottom: 0,
    fontWeight: "normal",
  },
};

export default PublicationThirdStep;
