import React from "react";
import PropTypes from "prop-types";

class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div style={styles.backdrop}>
        <button className="ui button" style={styles.button}>
          <i
            className="close icon"
            style={styles.icon}
            onClick={this.props.onClose}
          />
        </button>
        <div style={styles.modal}>{this.props.children}</div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: "5% 20%",
    zIndex: 999,
  },

  modal: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "100%",
    height: "100%",
    //   maxWidth: 800,
    //   minHeight: 600,
    overflowY: "scroll",
    margin: "0 auto",
    padding: 50,
  },

  button: {
    position: "relative",
    top: 15,
    left: -5,
    padding: 5,
    zIndex: 100,
  },

  icon: {
    margin: 0,
  },
};

export default Modal;
