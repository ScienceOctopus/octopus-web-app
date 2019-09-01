import React from "react";

const PublicationUpload = props => {
  return (
    <div>
      <label htmlFor="file" className="ui icon" style={{ cursor: "pointer" }}>
        <span style={styles.uploadText}>
          Upload an {props.stageName} document
        </span>
        <div
          className="ui icon button publication"
          style={styles.uploadIconContainer}
        >
          <i className="ui upload icon" style={{ color: "#4A74AF" }} />
        </div>
      </label>
      <input
        type="file"
        id="file"
        name="file"
        onChange={props.onSelect}
        style={{ display: "none" }}
      />
    </div>
  );
};

const styles = {
  uploadText: {
    color: "#4A74AF",
    fontWeight: "bold",
    fontSize: 17,
  },

  uploadFileButton: {
    backgroundColor: "white",
    color: "#4A74AF",
  },

  uploadIconContainer: {
    padding: "0.35rem",
    marginLeft: 20,
  },
};

export default PublicationUpload;
