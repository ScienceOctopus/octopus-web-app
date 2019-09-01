import React, { Component } from "react";
import WebURI from "../../urls/WebsiteURIs";
import Api from "../../api";

class PublicationSearchTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publication: undefined,
      collaborators: [],
    };
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  componentDidMount() {
    Api()
      .publication(this.props.publication.id)
      .collaborators()
      .get()
      .then(collaborators => {
        this.setState({ collaborators: [] }, () => {
          collaborators.forEach(collaborator => {
            Api()
              .user(collaborator.user)
              .get()
              .then(user => {
                this.setState(state => {
                  var augmented = state;
                  augmented.collaborators = augmented.collaborators.filter(
                    collaborator => collaborator.id !== user.id,
                  );
                  augmented.collaborators.push(user);
                  return augmented;
                });
              })
              .catch(err => console.log(err));
          });
        });
      });
  }

  checkIfLinked = (publicationId, publicationsToLink) => {
    console.log("publicationsToLink", publicationsToLink);
    const getPublication = publicationsToLink.find(
      publication => publication === publicationId,
    );
    console.log("getPublication", getPublication);
    if (getPublication) return true;
    return false;
  };

  handleCheckbox() {
    console.log("jajajajajajajaja", this.props);
  }
  render() {
    console.log(this.props);
    console.log(this.state);
    const dateAdded = new Date(
      this.props.publication.created_at,
    ).toLocaleDateString("en-US");

    return (
      <div className="ui grid" style={styles.publicationTemplateContainer}>
        <div className="twelve wide column">
          <div style={styles.title}>{this.props.publication.title}</div>
          {this.state.collaborators.length > 0 && (
            <div className="ui relaxed horizontal list">
              {this.state.collaborators.map((collaborator, index) => (
                <div
                  key={index}
                  className="item"
                  style={styles.collaboratorsList}
                >
                  <a
                    style={{ fontSize: 16 }}
                    href={WebURI.OrcidPage(collaborator.orcid)}
                  >
                    {collaborator.display_name}
                  </a>
                  ,
                </div>
              ))}
            </div>
          )}

          <div style={styles.sectionDate}>
            <b>Date added:</b>
            &nbsp;
            {dateAdded}
          </div>
        </div>
        <div className="four wide column">
          <p style={styles.extraItem}>
            <b>Data ID:</b>
            &nbsp;
          </p>
          <p style={styles.extraItem}>
            <b>File size:</b>
            &nbsp;
          </p>
          <p style={styles.extraItem}>
            <b>Data host:</b>
            &nbsp;
          </p>
          <p style={styles.extraItem}>
            <b>Average rating:</b>
            &nbsp;
          </p>
          <div style={styles.extraItem}>
            <b>Link to analysis</b>
            &nbsp;
            <div className="ui checkbox">
              <input
                type="checkbox"
                className="hidden"
                // onClick={this.props.handlePublicationsToLink(
                //   this.props.publication.id,
                // )}
                // checked={this.checkIfLinked(
                //   this.props.publication.id,
                //   this.props.publicationsToLink,
                // )}
                checked={false}
                onChange={this.handleCheckbox()}
              />
              <label style={{ marginTop: 3 }}></label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  publicationTemplateContainer: {
    backgroundColor: "#FFF",
    border: "1px solid #979797",
    borderRadius: 5,
    padding: 5,
    margin: 25,
  },
  extraItem: {
    marginBottom: 5,
  },
  title: {
    marginBottom: 10,
  },
  collaboratorsList: {
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 3,
    padding: 0,
  },
  sectionDate: {
    marginTop: 10,
  },
};

export default PublicationSearchTemplate;
