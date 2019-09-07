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
        <h4 style={styles.subtitle}>
          Add {this.props.stageName.toLowerCase()} documents to Octopus
        </h4>
        <hr />
        {(this.props.loading && (
          <div className="ui segment" style={styles.loader}>
            <div className="ui active inverted dimmer">
              <div className="ui text loader">Loading</div>
            </div>
          </div>
        )) || (
          <div>
            {(this.props.selectedFile || this.props.editorVisible) && (
              <div style={{ marginBottom: "2rem" }}>
                <br />
                <div className="ui input focus">
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
                      {Math.round((this.props.selectedFile.size / 1024) * 10) /
                        10}
                      MB
                    </span>
                  )}
                </div>
              </div>
            )}

            {this.props.editorData === "" && (
              <div className="ui segment" style={{ marginTop: 30 }}>
                <div className="ui two column very relaxed grid">
                  <div className="column" style={styles.textCenter}>
                    <label htmlFor="file" style={styles.uploadLabel}>
                      <i className="ui upload icon" style={styles.icon} />
                      <p style={styles.uploadText}>
                        Upload an {this.props.stageName.toLowerCase()} document
                      </p>
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
                      <i className="ui pencil icon" style={styles.icon} />
                      <p style={styles.uploadText}>
                        Use our editor to write your{" "}
                        {this.props.stageName.toLowerCase()}
                      </p>
                    </div>
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
        )}
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
    fontSize: 18,
    textAlign: "center",
    cursor: "pointer",
  },
  icon: {
    color: "#4A74AF",
    margin: 20,
    fontSize: "42px",
  },
  loader: {
    padding: 20,
  },
};

export default PublicationFirstStep;
