import React, { Component } from "react";
import Api from "../api";
import TitledForm from "../components/TitledForm";
import { loginRequired } from "./LogInRequiredPage";

class ProblemCreationPage extends Component {
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
        title,
        description,
        user: 1,
      });
  };

  submitEnabled() {
    return this.state.title && this.state.description;
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
      </div>
    );
  }
}

export default loginRequired(ProblemCreationPage);
