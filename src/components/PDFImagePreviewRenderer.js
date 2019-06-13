import React from "react";

import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "/static/js/pdf.worker.min.js";

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
