import React, { Component } from "react";
import Api from "../api";
import TitledForm from "../components/TitledForm";
import { loginRequired } from "./LogInRequiredPage";
import { RouterURI, generateLocalizedPath } from "../urls/WebsiteURIs";

const INFO_TIMEOUT = 1000;

class ProblemCreationPage extends Component {
  createdProblemId = undefined;
  constructor(props) {
    super(props);
    this.state = { title: "", description: "", stages: undefined };
  }

  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  handleTitleChange = e => {
    this.setState({ title: e.target.value });
  };

  handleSubmit = async () => {
    let { title, description } = this.state;
    Api()
      .problems()
      .post({
        __DEBUG__: process.SHOW_DEBUG_SWITCH,
        title,
        description,
        user: global.session.user.id,
      })
      .then(this.handleProblemCreated);
  };

  handleProblemCreated = response => {
    this.createdProblemId = response.data;
    this.setState({ creationSuccessful: true }, () =>
      setTimeout(this.afterCreationInfoTimeout, INFO_TIMEOUT),
    );
  };

  afterCreationInfoTimeout = () => {
    this.props.history.push(
      generateLocalizedPath(RouterURI.UploadToProblem, {
        id: this.createdProblemId,
      }),
    );
  };

  submitEnabled() {
    return (
      this.state.title &&
      this.state.description &&
      !this.state.creationSuccessful
    );
  }

  renderSuccessfulCreated() {
    return (
      <h2>
        {"Problem Successfully created! "}
        {"Going back..."}
      </h2>
    );
  }

  render() {
    return (
      <div className="ui main container form">
        <TitledForm
          title="Problem Title"
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <TitledForm
          title="Problem Description"
          value={this.state.description}
          onChange={this.handleDescriptionChange}
        />
        <button
          className="ui submit button"
          onClick={this.handleSubmit}
          disabled={!this.submitEnabled()}
        >
          Submit
        </button>
        {this.state.creationSuccessful && this.renderSuccessfulCreated()}
      </div>
    );
  }
}

export default loginRequired(ProblemCreationPage);
