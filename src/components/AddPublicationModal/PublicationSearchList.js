import React, { Component } from "react";
import Api from "../../api";
import PublicationSearchTemplate from "./PublicationSearchTemplate";

const SEARCH_KEY = "search";

class PublicationSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: true, publications: [] };

    // Always start a new cache when the search page is loaded
    Api().subscribeClass(SEARCH_KEY, Math.random());
  }

  componentDidMount() {
    this.setState({
      publications: this.props.publications,
    });
  }

  componentWillUnmount() {
    Api().unsubscribeClass(SEARCH_KEY);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.query !== this.props.query) {
      let newPublications = this.props.publications.filter(publication =>
        publication.title.includes(this.props.query),
      );

      this.setState({
        publications: newPublications,
      });

      this.loadingComplete();
    }
  }

  updatePublicationsList = publications => {
    this.setState({
      publications: publications
        .filter(x => x.orcid !== global.session.user.orcid)
        .filter(
          x =>
            !this.props.excluded ||
            !this.props.excluded.find(y => y.orcid === x.orcid),
        ),
    });
  };

  loadingComplete() {
    if (this.props.onLoaded) this.props.onLoaded();
  }

  render() {
    if (!this.props.publications.length) {
      return <h1>Nothing found for query "{this.props.query}"!</h1>;
    }
    return (
      <div style={styles.publicationsListContainer}>
        {this.state.publications.map((publication, index) => (
          <PublicationSearchTemplate
            key={index}
            publication={publication}
            onSelect={this.props.onSelect}
            publicationCollaborators={this.props.publicationCollaborators}
            handlePublicationsToLink={this.props.handlePublicationsToLink}
            publicationsToLink={this.props.publicationsToLink}
          />
        ))}
      </div>
    );
  }
}

const styles = {
  publicationsListContainer: {
    border: "1px solid #979797",
    overflowX: "hidden",
    overflowY: "auto",
    borderRadius: 5,
    marginTop: 10,
    maxHeight: 400,
  },
};

export default PublicationSearchList;
