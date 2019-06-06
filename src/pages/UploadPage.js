import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { LoginDataContext } from "../LoginContext";
import Api from "../api";
import FileUploadSelector from "../components/FileUploadSelector";
import PublicationSelector from "../components/PublicationSelector";
import SimpleSelector from "../components/SimpleSelector";
import TitledForm from "../components/TitledForm";
import TitledCheckbox from "../components/TitledCheckbox";

class UploadPage extends Component {
  static contextType = LoginDataContext;

  constructor(props) {
    super(props);

    this._isMounted = false;
    this._setStateTask = undefined;

    if (!this.props.location || !this.props.location.state) {
      this.state = {
        selectedProblemId: undefined,
        selectedStageId: undefined,
        isReview: false,
        publicationsToLink: [],
        title: "",
        summary: "",
        funding: "",
        data: {},
        selectedFile: undefined,

        linkedProblemsSelected: false,

        problems: [],
        stages: [],
        publications: undefined,
      };

      Api()
        .problems()
        .get()
        .then(problems =>
          this.setState({ problems: problems }, () =>
            this.props.history.replace(
              this.props.location.pathname,
              this.state,
            ),
          ),
        );
    } else {
      this.state = this.props.location.state;

      this.initCheck(this.props);
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._setStateTask !== undefined) {
      let task = this._setStateTask;
      this._setStateTask = undefined;

      task();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setState(newState, callback) {
    let task = () => super.setState(newState, callback);

    if (this._isMounted) {
      task();
    } else if (this._setStateTask === undefined) {
      this._setStateTask = task;
    } else if (callback !== undefined) {
      let oldTask = this._setStateTask;

      this._setStateTask = () => {
        oldTask();
        task();
      };
    }
  }

  initCheck(props) {
    let { id: problem, stage, review } = (props.match
      ? props.match
      : props
    ).params;

    let isReview = review !== undefined || props.review === true;

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
      .problem(this.state.selectedProblemId)
      .stages()
      .get()
      .then(stages => {
        stages.sort((a, b) => a.order - b.order);

        stages.forEach(stage => (stage.schema = JSON.parse(stage.schema)));

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
          }
        });

      this.setState({ data: data });
    }

    if (!this.shouldRenderLinkingSelector()) {
      return;
    }

    const stageToReview =
      this.state.selectedStageId - (this.state.isReview ? 0 : 1);

    Api()
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
    data.set("user", this.context.user.id);
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
    let url = "/publish/";

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

  handleProblemSelect = problemId => {
    this.props.history.replace(
      UploadPage.uploadURLBuilder(
        problemId,
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
      (this.isReview ||
        this.state.stages
          .find(stage => stage.id === Number(this.state.selectedStageId))
          .schema.every(field => {
            let content = this.state.data[field[0]];
            return content !== undefined && content !== "";
          }))
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
    this.props.history.replace(
      UploadPage.uploadURLBuilder(
        this.state.selectedProblemId,
        this.state.selectedStageId,
        e.target.checked || undefined,
      ),
    );
  };

  componentWillReceiveProps(nextProps) {
    this.initCheck(nextProps);
  }

  render() {
    if (this.context.user === undefined) {
      return (
        <div className="ui main text container">
          <div className="ui negative icon message">
            <i className="key icon" />
            <div className="content">
              <div className="header">Log-in required</div>
              <p>Logging in via your ORCiD is required to post publications.</p>
            </div>
          </div>
        </div>
      );
    }

    let metaData = null;

    if (
      this.state.isReview === false &&
      this.state.selectedStageId !== undefined
    ) {
      let stage = this.state.stages.find(
        stage => stage.id === Number(this.state.selectedStageId),
      );

      if (stage !== undefined && this.state.data !== undefined) {
        metaData = (
          <>
            {stage.schema.map(([key, type, title, description]) => {
              let value = this.state.data[key];
              let onChange = this.handleDataChange(key);

              switch (type) {
                case "file":
                  return (
                    <FileUploadSelector
                      key={key}
                      title={title}
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
                      description={description}
                      checked={value}
                      onChange={onChange}
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
      <div className="ui main container">
        <div className="ui segment">
          <div
            className={
              "ui " + (this.state.uploading ? "loading " : "") + "form"
            }
          >
            <h2 className="ui dividing header">
              <i className="ui pencil icon" />
              Publish your work
            </h2>
            <div className="two fields">
              <div className="field">
                <SimpleSelector
                  title="Select a Problem"
                  value={this.state.selectedProblemId}
                  data={this.state.problems}
                  accessor={x => [x.title, x.id]}
                  onSelect={this.handleProblemSelect}
                />
              </div>
              {this.state.selectedProblemId !== undefined && (
                <div className="field">
                  <SimpleSelector
                    title="Select a Publication Type"
                    value={this.state.selectedStageId}
                    data={this.state.stages}
                    accessor={x => [x.singular, x.id]}
                    onSelect={this.handleStageSelect}
                  />
                </div>
              )}
            </div>
            <div className="inline field">
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  onChange={this.handleReviewChange}
                  checked={this.state.isReview}
                  id="is-review"
                />
                <label htmlFor="is-review">This publication is a review</label>
              </div>
            </div>
            {this.shouldRenderLinkingSelector() && this.renderLinkingSelector()}
            <TitledForm
              title="Publication Title"
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
            <TitledForm
              title="Publication Summary"
              value={this.state.summary}
              onChange={this.handleSummaryChange}
            />
            <TitledForm
              title="Funding Statement"
              value={this.state.funding}
              onChange={this.handleFundingChange}
            />
            <FileUploadSelector
              title="Publication Document"
              onSelect={this.handleFileSelect}
            />
            <div className="ui divider" />
            {metaData}
            <button
              className="ui submit button"
              onClick={this.handleSubmit}
              disabled={!this.submitEnabled()}
            >
              Submit
            </button>{" "}
            as publication author{" "}
            <strong>{this.context.user.display_name}</strong>.
            {this.state.uploadSuccessful && (
              <Redirect to={`/publications/${this.state.insertedId}`} />
            )}
          </div>
        </div>
      </div>
    );
  }

  renderLinkingSelector() {
    let title;

    if (
      this.state.publications !== undefined &&
      this.state.publications.length <= 0
    ) {
      if (this.state.isReview) {
        title = "There are no publications to review in this stage";
      } else {
        title = "There are no publications from the previous stage to link to.";
      }

      title = <span style={{ color: "red" }}>{title}</span>;
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
        singleSelection={this.state.isReview}
        publications={this.state.publications || []}
        selection={this.state.publicationsToLink}
        onSelection={this.handleLinkedPublicationsChanged}
      />
    );
  }
}

export default withRouter(UploadPage);
