import React, { Component } from "react";

import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.NODE_ENV !== "test" &&
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("file-loader!../../node_modules/pdfjs-dist/build/pdf.worker.min.js");

class PDFImagePreviewRenderer extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  handlePdfLoad = ref => {
    if (ref) {
      ref.firstChild.style.width = "100%";
      ref.firstChild.style.height = "";
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.document.uri !== this.props.document.uri) {
      if (this.ref && this.ref.current && this.ref.current.state.pdf) {
        this.ref.current.state.pdf.loadingTask.destroy();
      }
    }
  }

  componentWillUnmount() {
    if (this.ref && this.ref.current && this.ref.current.state.pdf) {
      this.ref.current.state.pdf.loadingTask.destroy();
    }
  }

  render() {
    return (
      <div>
        <Document file={this.props.document.uri} ref={this.ref}>
          <Page
            inputRef={this.handlePdfLoad}
            pageNumber={1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>
    );
  }
}

export default PDFImagePreviewRenderer;
