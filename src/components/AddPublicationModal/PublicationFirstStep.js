import React, { Component } from "react";
import PublicationUpload from "./PublicationUpload";
import HandleEditor from "./HandleEditor";

class PublicationFirstStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorVisible: false,
    };
  }

  render() {
    return (
      <div>
        <h4 style={styles.subtitle}>
          Add {this.props.stageName.toLowerCase()} documents to Octopus
        </h4>
        <hr />
        {this.props.selectedFile && (
          <div style={{ marginBottom: "1rem" }}>
            <br />
            <div className="ui mini input">
              <input
                type="text"
                name="title"
                placeholder="Please write a title (30 characters)"
                value={this.props.publicationTitle}
                style={styles.titleInput}
                onChange={this.props.handleTitleChange}
              />
              <span style={styles.fileSize}>
                {Math.round((this.props.selectedFile.size / 1024) * 10) / 10}MB
              </span>
            </div>
          </div>
        )}

        {this.props.editorData === "" && (
          <div>
            <PublicationUpload
              onSelect={this.props.onFileSelect}
              selectedFile={this.props.selectedFile}
              stageName={this.props.stageName.toLowerCase()}
              handleTitleChange={this.props.handleTitleChange}
            />
            <h4 style={{ marginTop: "0.6rem", marginBottom: "0.6rem" }}>Or</h4>
            <span style={styles.uploadText} onClick={this.props.showEditor}>
              Use our editor to write your {this.props.stageName.toLowerCase()}
            </span>
          </div>
        )}

        <br />
        {this.props.editorVisible && (
          <HandleEditor
            selectedFile={this.props.selectedFile}
            editorData={this.props.editorData}
          />
        )}
      </div>
    );
  }
}

const styles = {
  titleInput: {
    width: 200,
    backgroundColor: "#F0F0F1",
    border: 0,
  },

  fileSize: {
    lineHeight: "30px",
    fontSize: 16,
    marginLeft: 20,
    color: "#A8A8A9",
  },
  subtitle: {
    marginTop: 20,
    marginBottom: 0,
    fontWeight: "normal",
  },
  uploadText: {
    color: "#4A74AF",
    fontWeight: "bold",
    fontSize: 17,
    cursor: "pointer",
  },
};

export default PublicationFirstStep;
