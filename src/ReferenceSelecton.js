import React, { Component } from "react";

const TEST_PDF_PATH = "resources/test/pdfs/test_pdf_1.pdf";

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

class ReferenceSelection extends Component {
  constructor(props) {
    super(props);
    this.state = { innerHtml: undefined };
    this.iframe = React.createRef();

    this.handleConvert();

    document.onmouseup = () => {
      console.log(window.getSelection().toString());
    };
  }

  handleConvert = () => {
    console.log("FETCHING");

    fetch("api/pdf2html", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: TEST_PDF_PATH,
      }),
    })
      .then(response => response.json())
      .then(htmlPath => {
        fetch(htmlPath)
          .then(page => {
            this.setState({ url: page.url });
            return page;
          })
          .then(page => page.text())
          .then(html => {
            this.setState({ innerHtml: { __html: html } });
          });
      });
  };

  render() {
    let props = {};
    if (this.state.innerHtml) {
      props.dangerouslySetInnerHTML = this.state.innerHtml;
    }
    return (
      <div style={styles.container}>
        <div {...props} />
      </div>
    );
  }
}

export default ReferenceSelection;
