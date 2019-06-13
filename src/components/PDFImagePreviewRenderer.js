import React from "react";

import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.NODE_ENV !== "test" &&
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("file-loader!../../node_modules/pdfjs-dist/build/pdf.worker.min.js");

const PDFImagePreviewRenderer = props => {
  return (
    <div>
      <Document file={props.document.uri}>
        <Page pageNumber={1} renderTextLayer={false} />
      </Document>
    </div>
  );
};

export default PDFImagePreviewRenderer;
