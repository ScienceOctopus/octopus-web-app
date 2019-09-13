import React, { Component } from "react";
import WebURI from "../../urls/WebsiteURIs";
import CustomRating from "../CustomRating";

class PublicationSearchTemplate extends Component {
  checkIfLinked = (publicationId, publicationsToLink) => {
    const checkLink = publicationsToLink.find(
      publication => publication === publicationId,
    );
    if (checkLink) return true;
    return false;
  };

  handleCheckbox = () => {
    this.props.handlePublicationsToLink(this.props.publication.id);
  };

  render() {
    const { publication } = this.props;
    const dateAdded = new Date(publication.created_at).toLocaleDateString(
      "en-US",
    );

    const checked = this.checkIfLinked(
      publication.id,
      this.props.publicationsToLink,
    );

    const pubRating = publication.overAllRating ? publication.overAllRating : 0;

    return (
      <div
        className="ui grid"
        style={
          checked
            ? styles.checkedPublicationTemplateContainer
            : styles.publicationTemplateContainer
        }
      >
        <div className="twelve wide column">
          <div style={styles.title}>{publication.title}</div>
          {(publication.collaborators &&
            publication.collaborators.length > 0 && (
              <div className="ui relaxed horizontal list">
                {publication.collaborators.map((collaborator, index) => (
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
            )) ||
            null}

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
            {publication.id}
          </p>
          <p style={styles.extraItem}>
            <b>Average rating:</b>
            &nbsp;
            <CustomRating
              readonly={true}
              initialRating={pubRating}
              // size="20px"
            />
          </p>
          <div style={styles.extraItem}>
            <b>Link my new publication to this one</b>
            &nbsp;
            <div className="ui checkbox">
              <input
                type="checkbox"
                style={{ marginTop: 3 }}
                checked={checked}
                onChange={this.handleCheckbox}
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
  checkedPublicationTemplateContainer: {
    backgroundColor: "#FFF",
    border: "1px solid var(--octopus-theme-publication)",
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
