import React, { Component } from "react";
import WebURI from "../../urls/WebsiteURIs";
import UserSearch from "../UserSearch";

class PublicationSecondStep extends Component {
  componentDidMount() {
    this.props.handleCollaborators(global.session.user);
  }

  render() {
    return (
      <div>
        <h4 style={styles.subtitle}>Who worked on this publication?</h4>
        <hr />
        <div style={styles.collaboratorsList}>
          <div className="ui ordered list">
            {this.props.publicationCollaborators.map((collaborator, index) => (
              <a
                key={index}
                className="item"
                style={{ fontSize: 16 }}
                href={WebURI.OrcidPage(collaborator.orcid)}
              >
                <i>
                  <b>{collaborator.display_name}</b>
                </i>
                &nbsp; &nbsp; &nbsp;
                {`ORCID ${collaborator.orcid}`}
              </a>
            ))}
          </div>
        </div>
        <h4 style={{ marginTop: 30 }}>
          Add a collaborator
          <div className="ui form" style={{ marginTop: 12 }}>
            <UserSearch
              onSelect={this.props.handleCollaborators}
              excluded={this.props.publicationCollaborators}
            />
          </div>
        </h4>
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
  addCollaboratorButtonContainer: {
    padding: "0.35rem",
    marginLeft: 20,
    border: "1px solid #4A74AF",
  },
  collaboratorsList: {
    overflowX: "hidden",
    overflowY: "auto",
    minHeight: 10,
    maxHeight: 350,
  },
};

export default PublicationSecondStep;
