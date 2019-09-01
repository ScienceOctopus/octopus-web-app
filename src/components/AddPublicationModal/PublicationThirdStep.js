import React, { Component } from "react";
// import PublicationLinkingTemplate from "./PublicationLinkingTemplate";
import PublicationSearchList from "./PublicationSearchList";
import SearchField from "../SearchField";
import SortField from "../SortField";

class PublicationThirdStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProblem: undefined,
      query: undefined,
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
    if (this.props.onSelect) {
      this.props.onSelect(problem);
    }
  };

  handleProblemsLoaded = () => {
    this.setState({ searchLoading: false });
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
        <div className="ui grid">
          <div className="eight wide column">
            <SearchField
              placeholder={`Search for ${this.props.previousStageData.name}`}
              onChange={this.handleSearchChange}
              onSubmit={this.handleSearchSubmit}
              loading={this.state.searchLoading}
              value={this.state.query}
            />
          </div>
          <div className="eight wide column" style={{ textAlign: "right" }}>
            <SortField />
          </div>
        </div>
        <PublicationSearchList
          query={this.state.query}
          onSelect={this.handleProblemSelect}
          onLoaded={this.handleProblemsLoaded}
          publications={this.props.previousStageData.publications}
          publicationCollaborators={this.props.publicationCollaborators}
          handlePublicationsToLink={this.props.handlePublicationsToLink}
          publicationsToLink={this.props.publicationsToLink}
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
