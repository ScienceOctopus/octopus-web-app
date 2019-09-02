import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AddPublicationStepsHandler from "./AddPublicationStepsHandler";
import LogInRequiredPage from "../../pages/LogInRequiredPage";
import Api from "../../api";

const SUPPORTED_EXTENSIONS = ["pdf", "doc", "docx", "tex"];

class PublicationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 1,
      publicationTitle: "",
      publicationCollaborators: [],
      editorVisible: false,
      editorData: "",

      publicationsToLink: [],
      title: "",
      summary: "",
      tags: ["octopus"],
      selectedFile: undefined,
      badFileSelected: false,

      linkedProblemsSelected: false,
      tagsIndex: 1,
    };
  }

  handlePublicationsToLink = publicationId => {
    const alreadyExists = this.state.publicationsToLink.includes(publicationId);

    if (alreadyExists) {
      let existentLinks = this.state.publicationsToLink;

      for (let i = 0; i < existentLinks.length; i++) {
        if (existentLinks[i] === publicationId) {
          existentLinks.splice(i, 1);
        }
      }
    } else {
      let publicationsToLink = this.state.publicationsToLink;
      publicationsToLink.push(publicationId);

      this.setState({ publicationsToLink });
    }
  };

  handleStepNumber = () => {
    if (this.state.publicationTitle !== "") {
      this.setState({
        stepNumber: this.state.stepNumber + 1,
      });
    }
  };

  handleSubmit = () => {
    console.log("we in");
  };

  handleFileSelect = event => {
    const file = event.target.files[0];
    if (!this.checkCorrectFile(file)) {
      this.setState({ badFileSelected: true });
      event.preventDefault();
      return;
    }

    this.setState({
      badFileSelected: false,
    });

    this.preprocessFile(file);

    this.setState({
      selectedFile: file,
    });
  };

  checkCorrectFile(file) {
    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (!SUPPORTED_EXTENSIONS.includes(extension)) return false;
    return true;
  }

  async preprocessFile(file) {
    // Scrape data
    let fileData = new FormData();
    fileData.append("file", file);
    fileData.set("data", JSON.stringify(fileData));

    Api()
      .fileToText()
      .post(fileData)
      .then(({ data }) => {
        if (
          file.type === "application/pdf" ||
          file.type === "application/msword"
        ) {
          this.showEditor(data.html[0]);
        } else {
          this.showEditor(data.html);
        }
      })
      .catch(err => console.log(err));
  }

  handleTitleChange = event => {
    this.setState({
      publicationTitle: event.target.value,
    });
  };

  handleCollaborators = collaborator => {
    this.setState(state => {
      let collaborators = [...state.publicationCollaborators];
      collaborators.push(collaborator);
      return { publicationCollaborators: collaborators };
    });
  };

  showEditor = editorData => {
    this.setState({ editorVisible: true, editorData: editorData });
  };

  onClose = close => {
    this.setState({
      stepNumber: 1,
      publicationTitle: "",
      publicationCollaborators: [],
      editorVisible: false,
      editorData: "",

      publicationsToLink: [],
      title: "",
      summary: "",
      tags: ["octopus"],
      selectedFile: undefined,
      badFileSelected: false,

      linkedProblemsSelected: false,
      tagsIndex: 1,
    });

    close();
  };

  render() {
    if (!this.props.show) {
      return null;
    }
    const previousStageId = this.props.stage.id - 2;
    const previousStageData = this.props.content.content.stages[
      previousStageId
    ];

    return (
      <div style={styles.backdrop}>
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
          <div
            className="ui button"
            style={styles.closeModalButton}
            onClick={() => this.onClose(this.props.onClose)}
          >
            <i className="close icon" style={styles.icon} />
          </div>
          <Presenter
            backgroundColor={this.props.backgroundColor}
            overflowX={this.props.overflowX}
            overflowY={this.props.overflowY}
            padding={this.props.padding}
            width={this.props.width}
          >
            {global.session.user === undefined ? (
              <LogInRequiredPage />
            ) : (
              <div>
                <h1 style={{ fontWeight: "bold" }}>
                  Add a new {this.props.stage.singular.toLowerCase()} - Step (
                  {this.state.stepNumber}
                  /3)
                </h1>
                <AddPublicationStepsHandler
                  stepNumber={this.state.stepNumber}
                  stageName={this.props.stage.singular}
                  onFileSelect={this.handleFileSelect}
                  selectedFile={this.state.selectedFile}
                  publicationTitle={this.state.publicationTitle}
                  handleTitleChange={this.handleTitleChange}
                  handleCollaborators={this.handleCollaborators}
                  publicationCollaborators={this.state.publicationCollaborators}
                  selectedStageId={this.props.stage.id}
                  selectedProblemId={this.props.stage.problem}
                  previousStageData={previousStageData}
                  showEditor={this.showEditor}
                  editorData={this.state.editorData}
                  editorVisible={this.state.editorVisible}
                  handlePublicationsToLink={this.handlePublicationsToLink}
                  publicationsToLink={this.state.publicationsToLink}
                />

                {this.state.stepNumber !== 3 ? (
                  <a
                    style={styles.nextStepButton}
                    onClick={this.handleStepNumber}
                  >
                    Next
                  </a>
                ) : (
                  <a style={styles.nextStepButton} onClick={this.handleSubmit}>
                    Submit
                  </a>
                )}
              </div>
            )}
          </Presenter>
        </div>
      </div>
    );
  }
}

PublicationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
  stage: PropTypes.object,
  content: PropTypes.object,
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: "10% 20%",
    zIndex: 9999,
  },

  closeModalButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 5,
    zIndex: 100,
    backgroundColor: "white",
  },

  icon: {
    margin: 0,
  },

  nextStepButton: {
    position: "absolute",
    right: 15,
    bottom: 20,
    color: "#2185d0",
    backgroundColor: "white",
    boxShadow: "none",
    borderWidth: 0,
    fontSize: 17,
    cursor: "pointer",
  },
};

const Presenter = styled.div`
  position: relative;
  background-color: ${p => p.backgroundColor || "#fff"};
  border-radius: 5px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: ${p =>
    p.padding !== undefined ? p.padding : "10px 20px 10px 20px"};
`;

export default PublicationModal;
