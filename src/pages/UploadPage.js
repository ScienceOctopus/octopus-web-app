import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Api from "../api";
import FileUploadSelector from "../components/FileUploadSelector";
import PublicationSelector from "../components/PublicationSelector";
import SimpleSelector from "../components/SimpleSelector";
import TitledCheckbox from "../components/TitledCheckbox";
import TitledForm from "../components/TitledForm";
import WebURI, {
  LocalizedRedirect,
  RouterURI,
  localizeLink,
  LocalizedLink,
} from "../urls/WebsiteURIs";
import { generatePath } from "react-router";
import uniqueId from "lodash/uniqueId";
import ProblemSelector from "../components/ProblemSelector";
import { loginRequired } from "./LogInRequiredPage";
import withState from "../withState";

const UPLOAD_KEY = "upload";

class UploadPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProblemId: undefined,
      selectedStageId: undefined,
      isReview: false,
      publicationsToLink: [],
      title: "",
      summary: "",
      funding: "",
      conflict: "",
      data: undefined,
      selectedFile: undefined,

      linkedProblemsSelected: false,

      problems: [],
      stages: [],
      publications: undefined,
    };

    // Always start a new cache when the upload page is loaded
    Api()
      .subscribeClass(UPLOAD_KEY, Math.random())
      .problems()
      .get()
      .then(problems =>
        this.setState({ problems: problems }, () => this.initCheck(this.props)),
      );
  }

  componentWillUnmount() {
    Api().unsubscribeClass(UPLOAD_KEY);
  }

  initCheck(props) {
    let { id: problem, stage, review } = (props.match
      ? props.match
      : props
    ).params;

    let isReview =
      review !== undefined ||
      props.review === true ||
      ((problem === undefined || stage === undefined) && this.state.isReview);

    if (problem !== this.state.selectedProblemId) {
      let callback = undefined;

      if (problem !== undefined) {
        callback = () => this.fetchStages(review);
      }

      this.setState(
        {
          selectedProblemId: problem,
          selectedStageId: stage,
          isReview: isReview,
          publications: undefined,
          publicationsToLink: [],
          linkedProblemsSelected: false,
          data: undefined,
        },
        callback,
      );
    } else if (stage !== this.state.selectedStageId) {
      let callback = undefined;

      if (stage !== this.state.problem) {
        callback = () => this.fetchPublications(review);
      }

      this.setState(
        {
          selectedStageId: stage,
          isReview: isReview,
          publications: undefined,
          publicationsToLink: [],
          linkedProblemsSelected: false,
          data: undefined,
        },
        callback,
      );
    } else if (isReview !== this.state.isReview) {
      this.setState(
        {
          isReview: isReview,
          publications: undefined,
          publicationsToLink: [],
          linkedProblemsSelected: false,
        },
        () => this.fetchPublications(review),
      );
    } else if (isReview) {
      review = Number(review);

      this.setState({
        publicationsToLink: this.state.publications.map(
          publication => publication.id === review,
        ),
        linkedProblemsSelected:
          this.state.publications.find(
            publication => publication.id === review,
          ) !== undefined,
      });
    }
  }

  fetchStages(review) {
    Api()
      .subscribe(UPLOAD_KEY)
      .problem(this.state.selectedProblemId)
      .stages()
      .get()
      .then(stages => {
        stages.sort((a, b) => a.order - b.order);

        stages.forEach(stage => {
          stage.schema = JSON.parse(stage.schema);
          stage.schema.forEach(scheme => {
            scheme.push(uniqueId("metadata-"));
          });
        });

        this.setState({ stages: stages }, () => {
          if (this.state.selectedStageId !== undefined) {
            this.fetchPublications(review);
          }
        });
      });
  }

  fetchPublications(review) {
    review = review ? Number(review) : undefined;

    if (review === undefined && this.state.data === undefined) {
      let data = {};

      this.state.stages
        .find(stage => stage.id === Number(this.state.selectedStageId))
        .schema.forEach(([key, type, title, description]) => {
          switch (type) {
            case "file":
              data[key] = undefined;
              break;
            case "uri":
              data[key] = "";
              break;
            case "text":
              data[key] = "";
              break;
            case "bool":
              data[key] = false;
              break;
            default:
            // No-op
          }
        });
      console.log(data);
      this.setState({ data: data });
    }

    if (!this.shouldRenderLinkingSelector()) {
      return;
    }

    const stageToReview =
      this.state.selectedStageId - (this.state.isReview ? 0 : 1);

    Api()
      .subscribe(UPLOAD_KEY)
      .problem(this.state.selectedProblemId)
      .stage(stageToReview)
      .publications()
      .get()
      .then(publications =>
        this.setState({
          publications: publications,
          publicationsToLink: publications.map(
            publication => publication.id === review,
          ),
          linkedProblemsSelected:
            publications.find(publication => publication.id === review) !==
            undefined,
        }),
      );
  }

  handleFileSelect = event => {
    const file = event.target.files[0];
    if (!this.checkCorrectFile(file)) return;

    this.preprocessFile(file);

    this.setState({
      selectedFile: file,
    });
  };

  handleSubmit = async () => {
    if (this.state.selectedFile === undefined) return;

    let linkedPublications = undefined;
    this.state.publications &&
      (linkedPublications = this.state.publications.filter(
        (_, i) => this.state.publicationsToLink[i],
      ));

    const data = new FormData();
    data.set("title", this.state.title);
    data.set("summary", this.state.summary);
    data.set("funding", this.state.funding);
    data.set("conflict", this.state.conflict);
    data.set("user", global.session.user.id);
    data.set("review", this.state.isReview);

    if (linkedPublications !== undefined) {
      data.set("basedOn", JSON.stringify(linkedPublications.map(x => x.id)));
    }

    data.append("file", this.state.selectedFile);

    let fileIdx = 1;

    if (this.state.isReview) {
      data.set("data", "[]");
    } else {
      let schema = this.state.stages.find(
        stage => stage.id === Number(this.state.selectedStageId),
      ).schema;

      let ddata = [];

      schema.forEach(([key, type, title, description]) => {
        let content = this.state.data[key];

        switch (type) {
          case "file":
            data.append("file", content);
            content = fileIdx++;
            break;
          case "uri":
            break;
          case "text":
            break;
          case "bool":
            break;
          default:
            return;
        }

        ddata.push(content);
      });

      data.set("data", JSON.stringify(ddata));
    }

    await this.setState({ uploading: true });

    Api()
      .subscribe(UPLOAD_KEY)
      .problem(this.state.selectedProblemId)
      .stage(this.state.selectedStageId)
      .publications()
      .post(data)
      .then(response => {
        this.setState({ insertedId: response.data, uploadSuccessful: true });
      })
      .catch(err => console.error(err.response))
      .finally(() => this.setState({ uploading: false }));
  };

  static uploadURLBuilder(problem, stage, review) {
    let url = localizeLink("/publish/");

    if (problem !== undefined) {
      url += `problems/${problem}`;

      if (stage !== undefined) {
        url += `/stages/${stage}`;

        if (review !== undefined) {
          url += "/review";

          if (review !== true) {
            url += `/${review}`;
          }
        }
      }
    }

    return url;
  }

  handleProblemSelect = problem => {
    this.props.history.replace(
      UploadPage.uploadURLBuilder(
        problem.id,
        undefined,
        this.state.isReview || undefined,
      ),
    );
  };

  handleStageSelect = stageId => {
    this.props.history.replace(
      UploadPage.uploadURLBuilder(
        this.state.selectedProblemId,
        stageId,
        this.state.isReview || undefined,
      ),
    );
  };

  handleTitleChange = e => {
    this.setState({
      title: e.target.value,
    });
  };

  handleSummaryChange = e => {
    this.setState({
      summary: e.target.value,
    });
  };

  handleFundingChange = e => {
    this.setState({
      funding: e.target.value,
    });
  };

  handleConflictChange = e => {
    this.setState({
      conflict: e.target.value,
    });
  };

  handleDataChange = key => e => {
    let field = this.state.stages
      .find(stage => stage.id === Number(this.state.selectedStageId))
      .schema.find(field => field[0] === key);
    let data = { ...this.state.data };

    let content = e.target;

    switch (field[1]) {
      case "file":
        content = content.files[0];
        break;
      case "uri":
        content = content.value;
        break;
      case "text":
        content = content.value;
        break;
      case "bool":
        content = content.checked;
        break;
      default:
        return;
    }

    data[key] = content;
    console.log(data);
    this.setState({ data: data });
  };

  handleLinkedPublicationsChanged = selection => {
    if (this.state.isReview) {
      this.props.history.replace(
        UploadPage.uploadURLBuilder(
          this.state.selectedProblemId,
          this.state.selectedStageId,
          (
            this.state.publications.find((publication, i) => selection[i]) || {
              id: true,
            }
          ).id,
        ),
      );
    } else {
      this.setState({
        publicationsToLink: selection,
        linkedProblemsSelected: selection.includes(true),
      });
    }
  };

  checkCorrectFile(file) {
    //TODO check file format
    return true;
  }

  preprocessFile(file) {
    // e.g. Scrape data
  }

  submitEnabled() {
    return (
      this.state.selectedFile &&
      this.state.selectedProblemId &&
      this.state.selectedStageId &&
      (!this.shouldRenderLinkingSelector() ||
        this.state.linkedProblemsSelected) &&
      this.state.title &&
      this.state.summary &&
      this.state.funding &&
      this.state.conflict &&
      (this.state.isReview ||
        (this.state.data !== undefined &&
          this.state.stages
            .find(stage => stage.id === Number(this.state.selectedStageId))
            .schema.every(field => {
              let content = this.state.data[field[0]];
              return content !== undefined && content !== "";
            })))
    );
  }

  shouldRenderLinkingSelector() {
    return (
      this.state.selectedStageId !== undefined &&
      (this.state.isReview ||
        Number(this.state.selectedStageId) !==
          (this.state.stages.length ? this.state.stages[0].id : undefined))
    );
  }

  handleReviewChange = e => {
    const isReview = e.target.checked;

    if (
      this.state.selectedProblemId !== undefined &&
      this.state.selectedStageId !== undefined
    ) {
      this.props.history.replace(
        UploadPage.uploadURLBuilder(
          this.state.selectedProblemId,
          this.state.selectedStageId,
          isReview || undefined,
        ),
      );
    } else {
      this.setState({ isReview: isReview });
    }
  };

  componentWillReceiveProps(nextProps) {
    let {
      id: new_problem,
      stage: new_stage,
      review: new_review,
    } = (nextProps.match ? nextProps.match : nextProps).params;
    let new_revall = nextProps.review;

    let { id: cur_problem, stage: cur_stage, review: cur_review } = (this.props
      .match
      ? this.props.match
      : this.props
    ).params;
    let cur_revall = this.props.review;

    if (
      new_problem !== cur_problem ||
      new_stage !== cur_stage ||
      new_review !== cur_review ||
      new_revall !== cur_revall
    ) {
      this.initCheck(nextProps);
    }
  }

  render() {
    let metaData = null;

    // Details of the currently selected stage, if any
    // TODO: duplication
    const selectedStage = this.state.stages.find(
      stage => stage.id === Number(this.state.selectedStageId),
    );

    // Whether a problem was selected, data loaded correctly, and an appropriate stage selected
    // Alternatively, whether the selected stage was the first in the publishing flow
    // TODO: duplicated below in renderLinkingSelector
    // TODO: clean up
    const problemAcceptsPublications =
      (this.state.publications !== undefined &&
        this.state.publications.length > 0) ||
      (selectedStage && selectedStage.order === 1);

    // Whether any problem was selected, for fields not depending on stages
    const problemSelected = this.state.selectedProblemId;

    if (
      this.state.isReview === false &&
      this.state.selectedStageId !== undefined
    ) {
      let stage = this.state.stages.find(
        stage => stage.id === Number(this.state.selectedStageId),
      );

      if (
        stage !== undefined &&
        this.state.data !== undefined &&
        stage.schema.length > 0
      ) {
        metaData = (
          <>
            {stage.schema.map(([key, type, title, description, id]) => {
              console.log(id);
              let value = this.state.data[key];
              let onChange = this.handleDataChange(key);

              switch (type) {
                case "file":
                  return (
                    <FileUploadSelector
                      key={key}
                      title={title}
                      disabled={!problemAcceptsPublications}
                      description={description}
                      files={[value]}
                      onSelect={onChange}
                    />
                  );
                case "uri":
                  return (
                    <TitledForm
                      key={key}
                      title={title}
                      disabled={!problemAcceptsPublications}
                      description={description}
                      value={value}
                      onChange={onChange}
                    />
                  );
                case "text":
                  return (
                    <TitledForm
                      key={key}
                      title={title}
                      disabled={!problemAcceptsPublications}
                      description={description}
                      value={value}
                      onChange={onChange}
                    />
                  );
                case "bool":
                  return (
                    <TitledCheckbox
                      key={key}
                      title={title}
                      disabled={!problemAcceptsPublications}
                      description={description}
                      checked={value}
                      onChange={onChange}
                      id={id}
                    />
                  );
                default:
                  return null;
              }
            })}
            <div className="ui divider" />
          </>
        );
      }
    }

    return (
      <>
        <div className="ui text container">
          <div className="ui segment">
            <h2 className="ui dividing header">
              <i className="ui question icon" />
              How does this work?
            </h2>

            <p>
              Octopus currently accepts{" "}
              <LocalizedLink to={WebURI.More}>
                8 types of publication
              </LocalizedLink>
              , and every new publication must be linked to an existing one.
              Problems are the top of the publication chain. Reviews can be
              linked to any other kind of publication and should be treated as
              the same as any other kind of publication.
            </p>
            <p>
              Currently, you should upload your publication in pdf format
              (though .doc and .docx will be supported soon). There are no rules
              on style and layout, but healthcare researchers should be guided
              by the relevant{" "}
              <a href="https://www.equator-network.org">
                EQUATOR reporting guidelines
              </a>
              . You will no longer need to structure your publications like a
              paper, with an abstract and introduction as the publications above
              yours in the chain should serve this role.
            </p>
            <p>
              References should no longer be listed at the bottom, but instead
              should be live URL links within the text to DOIs.
            </p>
            <p>
              Publications will go live as soon as all authors have agreed to
              publication.
            </p>
          </div>
        </div>
        <div className="ui hidden divider" />
        <div className="ui text container">
          <div className="ui segment">
            <div
              className={`ui ${this.state.uploading ? "loading " : ""}${
                !problemAcceptsPublications ? "warning " : ""
              }form`}
            >
              <h2 className="ui dividing header">
                <i className="ui pencil icon" />
                Publish your work
              </h2>
              <div className="field">
                <ProblemSelector
                  selectedProblem={this.state.selectedProblemId}
                  problems={this.state.problems}
                  accessor={x => [x.title, x.id]}
                  appendPath={"/problems"}
                  onSelect={this.handleProblemSelect}
                />
              </div>
              {problemSelected && (
                <div className="field">
                  <SimpleSelector
                    title={
                      this.state.isReview
                        ? "Select the type of work you are reviewing"
                        : "Select the type of work you are publishing"
                    }
                    value={this.state.selectedStageId}
                    data={this.state.stages}
                    accessor={x => [x.singular, x.id]}
                    onSelect={this.handleStageSelect}
                  />
                </div>
              )}
              <div
                className={`inline ${!problemSelected ? "disabled" : ""} field`}
              >
                <div className="ui checkbox">
                  <input
                    type="checkbox"
                    onChange={this.handleReviewChange}
                    checked={this.state.isReview}
                    id="is-review"
                  />
                  <label htmlFor="is-review">
                    This publication is a review of a publication already on
                    Octopus
                  </label>
                </div>
              </div>
              {this.shouldRenderLinkingSelector() &&
                this.renderLinkingSelector()}
              <div className="ui hidden divider" />
              <TitledForm
                title="Publication Title"
                value={this.state.title}
                disabled={!problemAcceptsPublications}
                guidance="Okay! Now it's time to enter the details of the publication you wish to submit to Octopus. First, fill out the title and a brief summary of what the work is about."
                onChange={this.handleTitleChange}
              />
              <TitledForm
                title="Publication Summary"
                rows="2"
                value={this.state.summary}
                disabled={!problemAcceptsPublications}
                onChange={this.handleSummaryChange}
              />
              <TitledForm
                title="Funding Statement"
                value={this.state.funding}
                disabled={!problemAcceptsPublications}
                guidance='If this research has any funding sources you think readers should be aware of, add them here. If not, feel free to enter "None".'
                placeholder="For example, funded by the British Council"
                onChange={this.handleFundingChange}
              />
              <p />
              <TitledForm
                title="Conflict of Interest Declaration"
                value={this.state.conflict}
                disabled={!problemAcceptsPublications}
                guidance='Declare any potential conflicts of interest this publication may have in the following box. If there aren&apos;t any, just type "No conflicts of interest".'
                placeholder="For example, no conflicts of interest"
                onChange={this.handleConflictChange}
              />
              <FileUploadSelector
                title="Publication Document"
                disabled={!problemAcceptsPublications}
                onSelect={this.handleFileSelect}
              />
              <div className="ui divider" />
              {metaData}
              <p>Note: Fields marked with a red asterisk are required.</p>
              <button
                className="ui submit button"
                onClick={this.handleSubmit}
                disabled={!this.submitEnabled()}
              >
                Submit
              </button>{" "}
              as publication author{" "}
              <strong>{global.session.user.display_name}</strong>
              {" ("}
              {
                <a href={`https://orcid.org/${global.session.user.orcid}`}>
                  {global.session.user.orcid}
                </a>
              }
              {")"}.
              {this.state.uploadSuccessful && (
                <LocalizedRedirect
                  to={generatePath(RouterURI.Publication, {
                    id: this.state.insertedId,
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  renderLinkingSelector() {
    let title;

    if (
      this.state.publications !== undefined &&
      this.state.publications.length <= 0
    ) {
      const failureExplanation =
        "Publications in Octopus are always based on and linked to another publication, except for Hypotheses. For reviews, this would be another publication in the same stage, and for publications, another in the previous stage.";
      if (this.state.isReview) {
        return (
          <div className="ui icon warning message">
            <i className="info icon" />
            <div className="content">
              <div className="header">
                There are no publications to review in this stage
              </div>
              <p>{failureExplanation}</p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="ui icon warning message">
            <i className="info icon" />
            <div className="content">
              <div className="header">
                There are no publications from the previous stage to link to
              </div>
              <p>{failureExplanation}</p>
            </div>
          </div>
        );
      }
    } else {
      if (this.state.isReview) {
        title = "Which publication are you reviewing?";
      } else {
        title = "Which publications should yours be linked to?";
      }
    }

    return (
      <PublicationSelector
        title={title}
        selectionEnabled
        singleSelection={this.state.isReview}
        publications={this.state.publications || []}
        selection={this.state.publicationsToLink}
        onSelection={this.handleLinkedPublicationsChanged}
      />
    );
  }
}

export default loginRequired(withRouter(withState(UploadPage)));
