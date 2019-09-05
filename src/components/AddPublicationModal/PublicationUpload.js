import React from "react";

const PublicationUpload = props => {
  return (
    <div style={styles.uploadContainer}>
      <div
        className="ui icon basic button publication"
        style={styles.uploadIconContainer}
      >
        <i className="ui upload icon" style={{ color: "#4A74AF" }} />
      </div>
        <p style={styles.uploadText}>Upload an {props.stageName} document</p>
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
    fontSize: 18,
  },

  uploadIconContainer: {
    padding: "0.35rem",
    margin: 20,
    fontSize: "42px",
  },

  uploadContainer: {
    textAlign: "center",
  },
};

export default PublicationUpload;
