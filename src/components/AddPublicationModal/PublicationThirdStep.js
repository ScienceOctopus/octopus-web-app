import React, { Component } from "react";
// import PublicationLinkingTemplate from "./PublicationLinkingTemplate";
import PublicationSearchList from "./PublicationSearchList";
import SearchField from "../SearchField";
import SortField from "../SortField";
import Api from "../../api";

const SUMMARY_KEY = "summary";

class PublicationThirdStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProblem: undefined,
      query: undefined,
      sortCategory: "Sort by",
      sortAscendent: false,
      sortDescendent: false,
      publicationsList: this.props.previousStageData.publications,
    };
  }

  componentDidMount() {
    this.addRatingsToPublications();
  }

  addRatingsToPublications() {
    let publicationsList = [...this.state.publicationsList];
    if (publicationsList.length > 0) {
      publicationsList.forEach(async (pub, index) => {
        await this.fetchPublicationRatings(pub);
      });
    }
  }

  fetchPublicationRatings(publication) {
    let newPublicationsList = [];
    Api()
      .subscribe(SUMMARY_KEY)
      .publication(publication.id)
      .publication_ratings(publication.id)
      .get()
      .then(publicationRatings => {
        let quality = 0;
        let sizeOfDataset = 0;
        let correctProtocol = 0;
        let counter = 1;

        publicationRatings.forEach(rating => {
          counter++;
          quality = quality + rating.quality;
          sizeOfDataset = sizeOfDataset + rating.sizeOfDataset;
          correctProtocol = correctProtocol + rating.correctProtocol;
        });

        const overAllRating = Math.round(
          (quality / counter +
            sizeOfDataset / counter +
            correctProtocol / counter) /
            3,
        );

        publication.overAllRating = overAllRating;
        newPublicationsList.push(publication);
      })
      .then(() => this.setState({ publicationsList: newPublicationsList }));
  }

  handleSortCategory = sortCategory => {
    this.setState({ sortCategory });

    if (this.state.sortAscendent) this.handleAscendent();
    if (this.state.sortDescendent) this.handleDescendent();
  };

  handleAscendent = () => {
    let clonePublicationsList = [...this.state.publicationsList];

    switch (this.state.sortCategory) {
      case "Alphabetically":
        clonePublicationsList.sort(function(a, b) {
          return a["title"].localeCompare(b["title"]);
        });
        break;
      case "Date":
        clonePublicationsList.sort(function(a, b) {
          return new Date(a.created_at) - new Date(b.created_at);
        });
        break;
      case "Rating":
        clonePublicationsList.sort(function(a, b) {
          return new Date(a.overAllRating) - new Date(b.overAllRating);
        });
        break;
      default:
        break;
    }

    this.setState({
      publicationsList: clonePublicationsList,
      sortAscendent: true,
      sortDescendent: false,
    });
  };

  handleDescendent = () => {
    let clonePublicationsList = [...this.state.publicationsList];

    switch (this.state.sortCategory) {
      case "Alphabetically":
        clonePublicationsList.sort(function(a, b) {
          return b["title"].localeCompare(a["title"]);
        });
        break;
      case "Date":
        clonePublicationsList.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        break;
      case "Rating":
        clonePublicationsList.sort(function(a, b) {
          return new Date(b.overAllRating) - new Date(a.overAllRating);
        });
        break;
      default:
        break;
    }

    this.setState({
      publicationsList: clonePublicationsList,
      sortAscendent: false,
      sortDescendent: true,
    });
  };

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

    return (
      <div>
        {(this.props.loading && (
          <div>
            <div className="ui active inverted dimmer" style={styles.dimmer}>
              <div className="ui text loader">Loading</div>
            </div>
          </div>
        )) ||
          null}
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
            <SortField
              handleSortCategory={this.handleSortCategory}
              handleAscendent={this.handleAscendent}
              handleDescendent={this.handleDescendent}
              sortCategory={this.state.sortCategory}
              sortAscendent={this.state.sortAscendent}
              sortDescendent={this.state.sortDescendent}
            />
          </div>
        </div>
        <PublicationSearchList
          query={this.state.query}
          onSelect={this.handleProblemSelect}
          onLoaded={this.handleProblemsLoaded}
          publications={this.state.publicationsList}
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
  dimmer: {
    borderRadius: 4,
  },
};

export default PublicationThirdStep;
