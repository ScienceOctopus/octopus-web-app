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
        {(this.props.selectedFile || this.props.editorVisible) && (
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
              {this.props.selectedFile && (
                <span style={styles.fileSize}>
                  {Math.round((this.props.selectedFile.size / 1024) * 10) / 10}
                  MB
                </span>
              )}
            </div>
          </div>
        )}

        {this.props.editorData === "" && (
          <div className="ui segment">
            <div className="ui two column very relaxed grid">
              <div className="column">
                <label
                  htmlFor="file"
                  className="ui icon"
                  style={{ cursor: "pointer" }}
                >
                  <PublicationUpload
                    onSelect={this.props.onFileSelect}
                    selectedFile={this.props.selectedFile}
                    stageName={this.props.stageName.toLowerCase()}
                    handleTitleChange={this.props.handleTitleChange}
                  />
                </label>
              </div>

              <div
                className="column"
                style={styles.uploadText}
                onClick={this.props.showEditor}
              >
                <div
                  className="ui icon basic button publication"
                  style={styles.uploadIconContainer}
                >
                  <i className="ui pencil icon" style={{ color: "#4A74AF" }} />
                </div>
                <p>
                  Use our editor to write your{" "}
                  {this.props.stageName.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="ui vertical divider">Or</div>
          </div>
        )}
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
    fontSize: 18,
    textAlign: "center",
    cursor: "pointer",
  },
  uploadIconContainer: {
    padding: "0.35rem",
    margin: 20,
    fontSize: "42px",
  },
};

export default PublicationFirstStep;
