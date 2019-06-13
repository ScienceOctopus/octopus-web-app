import React, { useRef } from "react";

import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

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
