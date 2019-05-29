import React, { Component } from "react";
import TitledForm from "../components/TitledForm";

export default class UploadPage extends Component {
  render() {
    return (
      <div>
        <h2>Upload</h2>
        <TitledForm title="Document Title" />
        <TitledForm title="Document Summary" />
      </div>
    );
  }
}
