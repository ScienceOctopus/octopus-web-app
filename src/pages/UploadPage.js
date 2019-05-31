import Axios from "axios";
import React, { Component } from "react";
import FileUploadSelector from "../components/FileUploadSelector";
import ProblemSelector from "../components/ProblemSelector";
import StageSelector from "../components/StageSelector";
import TitledForm from "../components/TitledForm";
import ApiURI from "../urls/ApiURIs";
import { Link } from "react-router-dom";
import PublicationSelector from "../components/PublicationSelector";

const DEBUG_VIEW = true;
const NONLINKING_STAGE = "1";

export default class UploadPage extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      description: "",
      linkedProblemsSelected: false,
      isReview: false,
    };

    if (DEBUG_VIEW) {
      this.state.title = "test";
      this.state.description = "test";
      this.state.selectedFile = "bad file";
      this.state.selectedProblemId = "1";
      this.state.selectedStageId = "3";
    }

    this.pubSelector = React.createRef();
  }

  handleFileSelect = event => {
    const file = event.target.files[0];
    if (!this.checkCorrectFile(file)) return;

    this.preprocessFile(file);

    this.setState({
      selectedFile: file,
    });
  };

  handleSubmit = async () => {
    if (this.state.selectedFile === undefined) return;

    let linkedPublications = this.pubSelector.current.getSelectedPublications();

    const data = new FormData();
    data.set("title", this.state.title);
    data.set("description", this.state.description);
    data.set("summary", "");
    data.set("review", this.state.isReview);
    data.set("basedOn", JSON.stringify(linkedPublications.map(x => x.id)));
    data.append("file", this.state.selectedFile);

    await this.setState({ uploading: true });

    Axios.post(
      ApiURI.PublicationUpload +
        `/${this.state.selectedProblemId}/stages/\
          ${this.state.selectedStageId}/publications`,
      data,
    )
      .then(() => {
        this.setState({ uploadSuccessful: true });
      })
      .catch(err => console.error(err.response))
      .finally(() => this.setState({ uploading: false }));
  };

  handleProblemSelect = problemId => {
    this.setState({
      selectedProblemId: problemId,
      linkedProblemsSelected: false,
    });
  };

  handleStageSelect = id => {
    this.setState({ selectedStageId: id, linkedProblemsSelected: false });
  };

  handleTitleChange = e => {
    this.setState({
      title: e.target.value,
    });
  };

  handleDescriptionChange = e => {
    this.setState({
      description: e.target.value,
    });
  };

  handleLinkedProblemSelected = selected => () => {
    this.setState({
      linkedProblemsSelected: selected,
    });
  };

  checkCorrectFile = file => {
    //TODO check file format
    return true;
  };

  preprocessFile = file => {
    // e.g. Scrape data
  };

  submitEnabled = () => {
    return (
      this.state.selectedFile &&
      this.state.selectedProblemId &&
      this.state.selectedStageId &&
      (!this.shouldRenderLinkingSelector() ||
        this.state.linkedProblemsSelected) &&
      this.state.title &&
      this.state.description
    );
  };

  shouldRenderLinkingSelector() {
    return (
      this.state.selectedStageId !== undefined &&
      (this.state.isReview || this.state.selectedStageId !== NONLINKING_STAGE)
    );
  }

  handleReviewChange = e => {
    this.setState({
      isReview: e.target.checked,
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <h2>Upload</h2>

        <ProblemSelector onSelect={this.handleProblemSelect} />
        {this.state.selectedProblemId !== undefined && (
          <StageSelector
            problemId={this.state.selectedProblemId}
            onSelect={this.handleStageSelect}
          />
        )}

        {this.shouldRenderLinkingSelector() && this.renderLinkingSelector()}

        <TitledForm
          title="Document Title"
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <TitledForm
          title="Document Summary"
          value={this.state.description}
          onChange={this.handleDescriptionChange}
        />
        <FileUploadSelector onSelect={this.handleFileSelect} />
        <h4>
          Is a review{" "}
          <input
            type="checkbox"
            onChange={this.handleReviewChange}
            checked={this.state.isReview}
          />
        </h4>

        {this.state.uploading && <h4>Uploading...</h4>}
        {this.state.uploadSuccessful && (
          <h4>
            {"Upload Successful!"}
            <Link to={`/problems/${this.state.selectedProblemId}`}>
              Go back to problem
            </Link>
          </h4>
        )}
        <button onClick={this.handleSubmit} disabled={!this.submitEnabled()}>
          Submit
        </button>
      </div>
    );
  }

  renderLinkingSelector() {
    return (
      <PublicationSelector
        ref={this.pubSelector}
        singleSelection={this.state.isReview}
        problemId={this.state.selectedProblemId}
        stageId={this.state.selectedStageId - (this.state.isReview ? 0 : 1)}
        selectedPublications={this.state.publicationsToLink}
        onSelect={this.handleLinkedProblemSelected(true)}
        onNoSelection={this.handleLinkedProblemSelected(false)}
      />
    );
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1em 1em",
    background: "#f9fafb",
    border: "1px solid lightgrey",
    borderRadius: "0.3rem",
    boxShadow: "0 0 0 0 transparent inset",
    margin: "2em 10em",
  },
};
