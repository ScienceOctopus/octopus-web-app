import Axios from "axios";
import React, { Component } from "react";
import FileUploadSelector from "../components/FileUploadSelector";
import ProblemSelector from "../components/ProblemSelector";
import StageSelector from "../components/StageSelector";
import TitledForm from "../components/TitledForm";
import ApiURI from "../urls/ApiURIs";
import { Redirect, withRouter } from "react-router-dom";
import PublicationSelector from "../components/PublicationSelector";

const NONLINKING_STAGE = "1";

class UploadPage extends Component {
  constructor(props) {
    super(props);

    let params = (props.match ? props.match : props).params;

    let problem = params.id;
    let stage = params.stage;

    this.state = {
      title: "",
      description: "",
      linkedProblemsSelected: false,
      isReview: false,
      selectedProblemId: problem,
      selectedStageId: stage,
    };

    if (process.DEBUG_MODE) {
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

    let linkedPublications = !this.shouldRenderLinkingSelector()
      ? []
      : this.pubSelector.current.getSelectedPublications();

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
        `/${this.state.selectedProblemId}/stages/${
          this.state.selectedStageId
        }/publications`,
      data,
    )
      .then(response => {
        this.setState({ insertedId: response.data, uploadSuccessful: true });
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
    this.setState({
      selectedStageId: id,
      linkedProblemsSelected: false,
    });
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
      <div className="ui main container">
        <div className="ui segment">
          <div
            className={
              "ui " + (this.state.uploading ? "loading " : "") + "form"
            }
          >
            <h2 className="ui dividing header">
              <i className="ui pencil icon" />
              Upload a new publication
            </h2>

            <div className="two fields">
              <div className="field">
                <ProblemSelector
                  onSelect={this.handleProblemSelect}
                  value={this.state.selectedProblemId}
                />
              </div>
              {this.state.selectedProblemId !== undefined && (
                <div className="field">
                  <StageSelector
                    problemId={this.state.selectedProblemId}
                    onSelect={this.handleStageSelect}
                    value={this.state.selectedStageId}
                  />
                </div>
              )}
            </div>
            <div className="inline field">
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  onChange={this.handleReviewChange}
                  checked={this.state.isReview}
                  id="is-review"
                />
                <label htmlFor="is-review">This publication is a review</label>
              </div>
            </div>
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
            <button
              className="ui submit button"
              onClick={this.handleSubmit}
              disabled={!this.submitEnabled()}
            >
              Submit
            </button>

            {this.state.uploadSuccessful && (
              <Redirect to={`/publications/${this.state.insertedId}`} />
            )}
          </div>
        </div>
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

export default withRouter(UploadPage);
