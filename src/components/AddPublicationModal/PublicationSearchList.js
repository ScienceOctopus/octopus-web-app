import React, { Component } from "react";
import Api from "../../api";
import PublicationSearchTemplate from "./PublicationSearchTemplate";

const SEARCH_KEY = "search";

const getDetails = orcid =>
  fetch(`https://pub.orcid.org/v2.1/${orcid}/person`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => res.json());

class PublicationSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      publications: this.props.publications,
    };

    // Always start a new cache when the search page is loaded
    Api().subscribeClass(SEARCH_KEY, Math.random());
  }

  componentWillUnmount() {
    Api().unsubscribeClass(SEARCH_KEY);
  }

  componentDidMount() {
    this.fetchPublicationCollaborators(this.props.publications);
    this.loadingComplete();
  }

  componentDidUpdate(oldProps) {
    if (
      JSON.stringify(oldProps.publications) !==
      JSON.stringify(this.props.publications)
    ) {
      // this.setState({ publications: this.props.publications });
      this.fetchPublicationCollaborators(this.props.publications);
    }

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

  fetchPublicationCollaborators(publications) {
    let publicationsList = [];
    publications.forEach(publication => {
      Api()
        .publication(publication.id)
        .collaborators()
        .get()
        .then(collaborators => {
          let collaboratorsNames = [];
          collaborators.forEach(async collaborator => {
            const details = await getDetails(collaborator.orcid);
            const { name } = details;
            let givenName, familyName, display_name;

            if (name && (name["given-names"] || name["family-name"])) {
              givenName = name["given-names"] ? name["given-names"].value : "";
              familyName = name["family-name"] ? name["family-name"].value : "";
              display_name = `${givenName} ${familyName}`;

              const collaboratorData = { display_name, orcid: name.path };

              collaboratorsNames.push(collaboratorData);
            }
            publication.collaborators = collaboratorsNames;
          });
        });
      publicationsList.push(publication);
    });
    this.setState({ publications: publicationsList });
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
