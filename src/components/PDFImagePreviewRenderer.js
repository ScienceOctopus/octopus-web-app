import React, { useRef } from "react";
import { usePdf } from "react-pdf-js";

const PDFImagePreviewRenderer = props => {
  const canvasEl = useRef(null);

  const [loading] = usePdf({
    file: props.state.publication.images[0].uri,
    page: 1,
    canvasEl,
  });

  return (
    <div>
      {loading && (
        <div className="ui active dimmer">
          <div className="ui text loader">
            Loading image preview: hang tight!
          </div>
        </div>
      )}
      <canvas ref={canvasEl} />
    </div>
  );
};

export default PDFImagePreviewRenderer;
