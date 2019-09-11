import React, { Component } from "react";
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
        {this.props.loading ? (
          <div>
            <div className="ui active inverted dimmer" style={styles.dimmer}>
              <div className="ui text loader">Loading</div>
            </div>
          </div>
        ) : null}
        <h4 style={styles.subtitle}>
          Add {this.props.stageName.toLowerCase()} documents to Octopus
        </h4>
        <hr />
        <div className="ui form">
          <br />
          <div className="field">
            <label htmlFor="title">Title of publication</label>
            <input
              type="text"
              name="title"
              id="title"
              value={this.props.publicationTitle}
              style={styles.titleInput}
              onChange={this.props.handleTitleChange}
              placeholder="Maximum of 500 characters"
              maxLength="500"
              autoFocus
            />
            {this.props.selectedFile && (
              <span style={styles.fileSize}>
                {Math.round((this.props.selectedFile.size / 1024) * 10) / 10}
                MB
              </span>
            )}
          </div>
          <div className="ui field">
            <label htmlFor="summary">Abstract of publication</label>
            <textarea
              name="summary"
              id="summary"
              value={this.props.publicationSummary}
              style={styles.summary}
              onChange={this.props.handleSummaryChange}
              placeholder="Maximum of 500 characters"
              maxLength="500"
            />
          </div>
          {(this.props.editorVisible && (
            <HandleEditor
              selectedFile={this.props.selectedFile}
              editorData={this.props.editorData}
              handleEditorData={this.props.handleEditorData}
            />
          )) || (
            <div className="ui field">
              <label>Upload publication (.docx or .pdf accepted)</label>
              <div className="ui segment" style={{ marginTop: 0 }}>
                <div className="ui two column very relaxed grid">
                  <div className="column" style={styles.textCenter}>
                    <label htmlFor="file" style={styles.uploadLabel}>
                      <span style={styles.uploadText}>
                        Upload an {this.props.stageName.toLowerCase()} document{" "}
                        <i className="ui upload icon" style={styles.icon} />
                      </span>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={this.props.onFileSelect}
                        style={styles.hidden}
                      />
                    </label>
                  </div>
                  <div className="column" style={styles.textCenter}>
                    <div onClick={this.props.showEditor}>
                      <span style={styles.uploadText}>
                        Use our editor to write your{" "}
                        {this.props.stageName.toLowerCase()}{" "}
                        <i className="ui pencil icon" style={styles.icon} />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ui vertical divider">Or</div>
              </div>
            </div>
          )}
          <div className="ui secondary segment">
            <p>
              Please check your publication for formatting and correct it in the
              editor as necessary. You will be able to add authorship details on
              the next page.
            </p>
          </div>
          <div className="ui field">
            <label htmlFor="data-repository">
              URL of data repository (optional)
            </label>
            <input
              type="text"
              name="data-repository"
              id="data-repository"
              value={this.props.dataRepository}
              style={styles.titleInput}
              onChange={this.props.handleDataRepositoryChange}
              placeholder="Maximum of 500 characters"
              maxLength="500"
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  uploadLabel: {
    display: "block",
    cursor: "pointer",
  },
  textCenter: {
    textAlign: "center",
    cursor: "pointer",
  },
  hidden: {
    display: "none",
  },
  titleInput: {
    width: 300,
  },
  summary: {
    width: "100%",
    maxWidth: "100%",
    height: 100,
    maxHeight: 250,
  },
  fileSize: {
    lineHeight: "44px",
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
    fontSize: 16,
    textAlign: "center",
    cursor: "pointer",
  },
  icon: {
    color: "#4A74AF",
    margin: 10,
  },
  dimmer: {
    borderRadius: 4,
  },
};

export default PublicationFirstStep;
