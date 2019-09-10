import React from "react";
import PublicationFirstStep from "./PublicationFirstStep";
import PublicationSecondStep from "./PublicationSecondStep";
import PublicationThirdStep from "./PublicationThirdStep";

const AddPublicationStepsHandler = props => {
  switch (props.stepNumber) {
    case 1:
      return (
        <PublicationFirstStep
          stageName={props.stageName}
          onFileSelect={props.onFileSelect}
          selectedFile={props.selectedFile}
          publicationTitle={props.publicationTitle}
          handleTitleChange={props.handleTitleChange}
          showEditor={props.showEditor}
          editorData={props.editorData}
          editorVisible={props.editorVisible}
          loading={props.loading}
        />
      );
    case 2:
      return (
        <PublicationSecondStep
          stageName={props.stageName}
          handleCollaborators={props.handleCollaborators}
          publicationCollaborators={props.publicationCollaborators}
        />
      );
    case 3:
      return (
        <PublicationThirdStep
          stageName={props.stageName}
          selecteStageId={props.selecteStageId}
          previousStageData={props.previousStageData}
          publicationCollaborators={props.publicationCollaborators}
          handlePublicationsToLink={props.handlePublicationsToLink}
          publicationsToLink={props.publicationsToLink}
          loading={props.loading}
        />
      );
    default:
      return null;
  }
};

export default AddPublicationStepsHandler;
