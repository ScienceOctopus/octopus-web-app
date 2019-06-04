import Axios from "axios";
import React, { Component } from "react";

import SimpleSelector from "../components/SimpleSelector";
import FileUploadSelector from "../components/FileUploadSelector";
import TitledForm from "../components/TitledForm";
import ApiURI from "../urls/ApiURIs";
import { Redirect, withRouter } from "react-router-dom";
import PublicationSelector from "../components/PublicationSelector";

class UploadPage extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this._setStateTask = undefined;

    /*if (!this.props.location || !this.props.location.state) {
      this.state = {
        selectedProblemId: undefined,
        selectedStageId: undefined,
        isReview: false,
        publicationsToLink: undefined,
        title: "",
        description: "",
        
        linkedProblemsSelected: false,
        
        content: {
          problems: [],
          stages: [],
          publications: [],
        }
      }
    } else {
      this.state = this.props.location.state;
    }*/

    let params = (props.match ? props.match : props).params;

    let problem, stage, selection;

    if (this.props.review) {
      problem = this.props.location.state.problem;
      stage = this.props.location.state.stage;
      selection = [Number(params.id)];
    } else {
      problem = params.id;
      stage = params.stage;
      selection = [];
    }

    this.state = {
      problems: [],
      stages: [],
      publications: [],

      selectedProblemId: problem,
      selectedStageId: stage,
      isReview: selection.length > 0,
      publicationsToLink: [],
      title: "",
      description: "",

      linkedProblemsSelected: false,
    };

    fetch("/api/problems")
      .then(response => response.json())
      .then(problems => this.setState({ problems: problems }));

    if (this.state.selectedProblemId !== undefined) {
      fetch(`/api/problems/${this.state.selectedProblemId}/stages`)
        .then(response => response.json())
        .then(stages => this.setState({ stages: stages }));

      if (this.state.selectedStageId !== undefined) {
        fetch(
          `/api/problems/${this.state.selectedProblemId}/stages/${this.state
            .selectedStageId - (this.state.isReview ? 0 : 1)}/publications`,
        )
          .then(response => response.json())
          .then(publications => {
            this.setState({
              publications: publications,
              publicationsToLink: publications.map(publication =>
                selection.includes(publication.id),
              ),
            });
          });
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._setStateTask !== undefined) {
      let task = this._setStateTask;
      this._setStateTask = undefined;

      task();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setState(newState, callback) {
    let task = () => super.setState(newState, callback);

    if (this._isMounted) {
      task();
    } else if (this._setStateTask === undefined) {
      this._setStateTask = task;
    } else if (callback !== undefined) {
      let oldTask = this._setStateTask;

      this._setStateTask = () => {
        oldTask();
        task();
      };
    }
  }

  handleFileSelect = event => {
    const file = event.target.files[0];
    if (!this.checkCorrectFile(file)) return;

    this.preprocessFile(file);

    this.setState({
      selectedFile: file,
    });
  };

  async handleSubmit() {
    if (this.state.selectedFile === undefined) return;

    let linkedPublications = this.state.publications.filter(
      (_, i) => this.state.publicationsToLink[i],
    );

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
  }

  handleProblemSelect = problemId => {
    let state = {
      selectedProblemId: problemId,
      linkedProblemsSelected: false,
    };
    let callback = undefined;

    if (problemId !== this.state.selectedProblemId) {
      state.selectedStageId = undefined;
      state.stages = [];
      state.publications = [];
      state.publicationsToLink = [];

      callback = () => {
        fetch(`/api/problems/${this.state.selectedProblemId}/stages`)
          .then(response => response.json())
          .then(stages => this.setState({ stages: stages }));
      };
    }

    this.setState(state, callback);
  };

  handleStageSelect = stageId => {
    let state = {
      selectedStageId: stageId,
      linkedProblemsSelected: false,
    };
    let callback = undefined;

    if (stageId !== this.state.selectedStageId) {
      state.publications = [];

      callback = () =>
        fetch(
          `/api/problems/${this.state.selectedProblemId}/stages/${this.state
            .selectedStageId - (this.state.isReview ? 0 : 1)}/publications`,
        )
          .then(response => response.json())
          .then(publications =>
            this.setState({
              publications: publications,
              publicationsToLink: Array(publications.length).fill(false),
            }),
          );
    }

    this.setState(state, callback);
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

  handleLinkedPublicationsChanged = selection => {
    this.setState({
      publicationsToLink: selection,
      linkedProblemsSelected: selection.includes(true),
    });
  };

  checkCorrectFile(file) {
    //TODO check file format
    return true;
  }

  preprocessFile(file) {
    // e.g. Scrape data
  }

  submitEnabled() {
    return (
      this.state.selectedFile &&
      this.state.selectedProblemId &&
      this.state.selectedStageId &&
      (!this.shouldRenderLinkingSelector() ||
        this.state.linkedProblemsSelected) &&
      this.state.title &&
      this.state.description
    );
  }

  shouldRenderLinkingSelector() {
    return (
      this.state.selectedStageId !== undefined &&
      (this.state.isReview ||
        Number(this.state.selectedStageId) !==
          (this.state.stages.length ? this.state.stages[0].id : undefined))
    );
  }

  handleReviewChange = e => {
    let callback = undefined;

    if (
      this.state.selectedProblemId !== undefined &&
      this.state.selectedStageId !== undefined
    ) {
      callback = () =>
        fetch(
          `/api/problems/${this.state.selectedProblemId}/stages/${this.state
            .selectedStageId - (this.state.isReview ? 0 : 1)}/publications`,
        )
          .then(response => response.json())
          .then(publications =>
            this.setState({
              publications: publications,
              publicationsToLink: Array(publications.length).fill(false),
            }),
          );
    }

    this.setState(
      {
        isReview: e.target.checked,
        publications: [],
        publicationsToLink: [],
      },
      callback,
    );
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
                <SimpleSelector
                  title="Select a Problem"
                  value={this.state.selectedProblemId}
                  data={this.state.problems}
                  accessor={x => [x.title, x.id]}
                  onSelect={this.handleProblemSelect}
                />
              </div>
              {this.state.selectedProblemId !== undefined && (
                <div className="field">
                  <SimpleSelector
                    title="Select a Publication Type"
                    value={this.state.selectedStageId}
                    data={this.state.stages}
                    accessor={x => [x.name, x.id]}
                    onSelect={this.handleStageSelect}
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
              title="Publication Title"
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
            <TitledForm
              title="Publication Summary"
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
        title={
          this.state.isReview
            ? "Which publication are you reviewing?"
            : "Which publications should yours be linked to?"
        }
        singleSelection={this.state.isReview}
        publications={this.state.publications}
        selection={this.state.publicationsToLink}
        onSelection={this.handleLinkedPublicationsChanged}
      />
    );
  }
}

export default withRouter(UploadPage);
