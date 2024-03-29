import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div style={styles.backdrop} ref={this.props.modalRef}>
        <div style={{ position: "relative", height: "100%" }}>
          <div
            className="ui button"
            style={styles.button}
            onClick={this.props.onClose}
          >
            <i className="close icon" style={styles.icon} />
          </div>
          <Presenter
            backgroundColor={this.props.backgroundColor}
            overflowX={this.props.overflowX}
            overflowY={this.props.overflowY}
            padding={this.props.padding}
            width={this.props.width}
          >
            {this.props.children}
          </Presenter>
        </div>
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
    zIndex: 9999,
  },

  modal: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    margin: "0 auto",
    padding: 50,
  },

  button: {
    position: "absolute",
    top: -5,
    left: -5,
    padding: 5,
    zIndex: 100,
  },

  icon: {
    margin: 0,
  },
};

const Presenter = styled.div`
  position: relative;
  background-color: ${p => p.backgroundColor || "#fff"};
  border-radius: 5px;
  width: 100%;
  height: 100%;
  overflow-x: ${p => p.overflowX || "scroll"};
  overflow-y: ${p => p.overflowY || "scroll"};
  margin: 0 auto;
  padding: ${p => (p.padding !== undefined ? p.padding : "50px")};
`;

export default Modal;
