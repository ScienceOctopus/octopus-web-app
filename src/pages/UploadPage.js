import axios from "axios";
import React, { Component } from "react";
import FileUploadSelector from "../components/FileUploadSelector";
import TitledForm from "../components/TitledForm";
import ApiURI from "../urls/ApiURIs";

export default class UploadPage extends Component {
  state = {};

  handleFileSelect = event => {
    const file = event.target.files[0];
    if (!this.checkCorrectFile(file)) return;

    this.preprocessFile(file);

    this.setState({
      selectedFile: file,
    });
  };

  handleSubmit = () => {
    if (this.state.selectedFile === undefined) return;

    const data = new FormData();
    data.append("file", this.state.selectedFile);

    axios
      .post(ApiURI.PublicationUpload + "/1/stages/1/publications", data)
      .then(res => {
        console.log(res);
      })
      .catch(console.error);
  };

  checkCorrectFile = file => {
    //TODO check file format
    return true;
  };

  preprocessFile = file => {
    // e.g. Scrape data
  };

  render() {
    return (
      <div>
        <h2>Upload</h2>
        <TitledForm title="Document Title" />
        <TitledForm title="Document Summary" />
        <FileUploadSelector onSelect={this.handleFileSelect} />
        <button
          onClick={this.handleSubmit}
          disabled={this.state.selectedFile === undefined}
        >
          Submit
        </button>
      </div>
    );
  }
}
