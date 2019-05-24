import axios from "axios";
import React, { Component } from "react";

const TEST_PDF_PATH = "resources/test/pdfs/test_pdf_1.pdf";
const API_PDF_URL = "api/pdf2html";

class ReferenceSelection extends Component {
  constructor(props) {
    super(props);
    this.state = { innerHtml: undefined, selectingStart: true };
    this.iframe = React.createRef();

    this.handleConvert();

    document.onmouseup = () => {
      console.log(window.getSelection().toString());
    };
  }

  handleConvert = () => {
    console.log("FETCHING");
    axios
      .post(API_PDF_URL, { source: TEST_PDF_PATH })
      .then(res => res.data)
      .then(htmlPath => {
        fetch(htmlPath)
          .then(page => page.text())
          .then(this.handleGotHtml);
      });
  };

  handleGotHtml = html => {
    this.setState({ innerHtml: { __html: html } });
  };

  handleClick = e => {
    console.log(e.target);

    let newState = { selectingStart: !this.state.selectingStart };
    if (this.state.selectingStart) {
      newState.selectingBeginning = e.target;
    } else {
      newState.selectionEnd = e.target;

      let between = allBetween(this.state.selectingBeginning, e.target);
      between.forEach(x => {
        x.style.backgroundColor = "red";
      });
    }

    this.setState(newState);
  };

  render() {
    let props = {};
    if (this.state.innerHtml) {
      props.dangerouslySetInnerHTML = this.state.innerHtml;
    }
    return (
      <div style={styles.container}>
        <div onClick={this.handleClick} {...props} />
      </div>
    );
  }
}

const allBetween = (elem, target) => {
  var siblings = [];

  while (elem !== target) {
    console.log(elem);
    siblings.push(elem);
    elem = elem.nextElementSibling;
  }

  return siblings;
};

const styles = {
  container: {
    width: "49vw",
    float: "left",
    backgroundColor: "red",
    padding: 5,
    height: "100vh",
    overflowX: "scroll",
    overflowY: "scroll",
    position: "relative",
  },
  iframe: {
    width: "100%",
    height: "100%",
  },
};

export default ReferenceSelection;
