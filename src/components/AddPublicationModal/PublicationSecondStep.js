import React, { Component } from "react";
import WebURI from "../../urls/WebsiteURIs";
import UserSearch from "../UserSearch";

class PublicationSecondStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAddCollaborator: false,
    };
  }

  componentDidMount() {
    this.props.handleCollaborators(global.session.user);
  }

  displayAddCollaborator = () => {
    this.setState({
      displayAddCollaborator: true,
    });
  };

  render() {
    return (
      <div>
        <h4 style={styles.subtitle}>Who worked on this publication?</h4>
        <hr />
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
          <h4 style={{ marginTop: 12, fontWeight: "normal" }}>
            add a collaborator
            {/* <div
              className="ui icon button publication"
              style={styles.addCollaboratorButtonContainer}
              onClick={this.displayAddCollaborator}
            >
              <i className="ui plus icon" style={{ padding: "0.2rem" }} />
            </div> */}
            <div className="ui form" style={{ marginTop: 12 }}>
              <UserSearch
                onSelect={this.props.handleCollaborators}
                excluded={this.props.publicationCollaborators}
              />
            </div>
          </h4>
        </div>
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
};

export default PublicationSecondStep;
