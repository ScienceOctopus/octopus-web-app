import React, { Component } from "react";
import PDFImagePreviewRenderer from "./PDFImagePreviewRenderer";
import styled from "styled-components";
import {
  LocalizedLink,
  generateLocalizedPath,
  RouterURI,
} from "../urls/WebsiteURIs";
import Api from "../api";
import withState from "../withState";
import TagSelector from "./TagSelector";
import CustomRating from "./CustomRating";

const SUMMARY_KEY = "summary";

class SummaryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstRating: 0,
      secondRating: 0,
      thirdRating: 0,
      reviewRating: 0,
      ratingsNames: undefined,
    };

    this.fetchPublicationData();
    this.handleReviewRating = this.handleReviewRating.bind(this);
  }

  componentWillUnmount() {
    Api().unsubscribeClass(SUMMARY_KEY);
  }

  handleReviewRating() {
    const reviewRating = this.state.reviewRating + 1;
    const data = {
      publicationId: this.props.publicationId,
      userId: global.session.user.id,
    };
    Api()
      .subscribe(SUMMARY_KEY)
      .publication(this.props.publicationId)
      .publication_review_rating()
      .post(data)
      .then(this.setState({ reviewRating, userAlreadyRated: true }));
  }

  fetchStageRatingsNames(stageId) {
    Api()
      .subscribe(SUMMARY_KEY)
      .publication(this.props.publicationId)
      .stage_ratings_names()
      .getQuery(stageId)
      .then(ratingsNames => this.setState({ ratingsNames: ratingsNames[0] }));
  }

  renderRatings() {
    const { review, draft } = this.state.publication;
    if (review && !draft) {
      return (
        <div style={styles.reviewRatingContainer}>
          {this.state.reviewRating}
          {global.session.user && !this.state.userAlreadyRated && (
            <i
              className="arrow up icon"
              style={styles.rateReview}
              onClick={this.handleReviewRating}
            />
          )}
        </div>
      );
    }
    return (
      <div className="ui">
        <p>
          {this.state.ratingsNames
            ? this.state.ratingsNames.firstRating
            : "High Quality & Annotated"}
        </p>
        <CustomRating
          readonly={true}
          initialRating={this.state.firstRating}
          emptySymbol={<i className="ratingIcon icon star outline" />}
          fullSymbol={<i className="ratingIcon icon star" />}
        />

        <br />
        <br />

        <p>
          {this.state.ratingsNames
            ? this.state.ratingsNames.secondRating
            : "Size of data"}
        </p>
        <CustomRating
          readonly={true}
          initialRating={this.state.secondRating}
          emptySymbol={<i className="ratingIcon icon star outline" />}
          fullSymbol={<i className="ratingIcon icon star" />}
        />

        <br />
        <br />

        <p>
          {this.state.ratingsNames
            ? this.state.ratingsNames.thirdRating
            : "Correct protocol"}
        </p>
        <CustomRating
          readonly={true}
          initialRating={this.state.thirdRating}
          emptySymbol={<i className="ratingIcon icon star outline" />}
          fullSymbol={<i className="ratingIcon icon star" />}
        />
      </div>
    );
  }

  renderRatingButton() {
    const { review, draft, problem, stage, id } = this.state.publication;

    return (
        <div
          className="ui icon button octopus-theme review"
          style={{
            padding: "0.5rem",
            margin: "-0.5rem 0.5rem -0.5rem 0",
          }}
          onClick={event => {
              var url = generateLocalizedPath(
                RouterURI.UploadToProblemStageReview,
                {
                  id: problem,
                  stage,
                  review: id,
                },
              );
              window.location = url;
          }}
        >
          <i
            className="ui pencil alternate icon"
            style={{
              marginRight: "0.5em",
              color: "black",
            }}
          />
          Write a review
        </div>
    );
  }

  static getContributions = collaborators => {
    return collaborators.reduce((map, collaborator) => {
      return map.set(collaborator.user, (map.get(collaborator.user) || 0) + 1);
    }, new Map());
  };

  static sortByLastName = (contributions, users) => {
    let knownUsers = [];

    contributions.forEach((amount, id) => {
      let user = users.get(id);

      if (user !== undefined) {
        knownUsers.push({ contributions: amount, ...user });
      }
    });

    knownUsers.sort((a, b) => {
      if (a.contributions !== b.contributions) {
        return a.contributions - b.contributions;
      }

      a = a.display_name.split(" ");
      b = b.display_name.split(" ");

      a = a[a.length - 1];
      b = b[b.length - 1];

      return a.localeCompare(b);
    });

    return knownUsers;
  };

  fetchPublicationData() {
    this.setState(
      {
        publication: undefined,
        collaborators: undefined,
        allCollaborators: undefined,
        users: new Map(),
        resources: undefined,
        stage: undefined,
        schema: undefined,
        stageNames: undefined,
        allPublications: undefined,
        tags: undefined,
      },
      () => {
        // Cache under a similar scope as the ProblemPage
        Api()
          .subscribeClass(SUMMARY_KEY, this.props.problemId)
          .publication(this.props.publicationId)
          .get()
          .then(publication => {
            publication.data = JSON.parse(publication.data);

            this.setState(
              {
                publication: publication,
              },
              () => {
                Api()
                  .subscribe(SUMMARY_KEY)
                  .problem(this.state.publication.problem)
                  .stage(this.state.publication.stage)
                  .get()
                  .then(stage => {
                    this.setState({
                      stage: stage,
                      schema: JSON.parse(stage.schema),
                    });
                    this.fetchStageRatingsNames(stage.id);
                  });
              },
            );
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .resources()
          .get()
          .then(resources => {
            this.setState({
              resources: resources,
            });
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .publication_ratings(this.props.publicationId)
          .get()
          .then(ratings => {
            let firstRating = 0;
            let secondRating = 0;
            let thirdRating = 0;
            let counter = 0;
            ratings.forEach(rating => {
              counter++;
              firstRating = firstRating + rating.firstRating;
              secondRating = secondRating + rating.secondRating;
              thirdRating = thirdRating + rating.thirdRating;
            });
            this.setState({
              firstRating: Math.round(firstRating / counter),
              secondRating: Math.round(secondRating / counter),
              thirdRating: Math.round(thirdRating / counter),
            });
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .publication_review_rating()
          .get()
          .then(reviewRatings => {
            let userAlreadyRated;
            reviewRatings.forEach(reviewRating => {
              if (
                global.session.user &&
                reviewRating.userId === global.session.user.id
              ) {
                userAlreadyRated = true;
              }
            });
            this.setState({
              userAlreadyRated,
              reviewRating: reviewRatings.length,
            });
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .collaborators()
          .get()
          .then(collaborators => {
            this.setState(
              { collaborators: SummaryView.getContributions(collaborators) },
              () => {
                this.state.collaborators.forEach((contributions, id) => {
                  Api()
                    .subscribe(SUMMARY_KEY)
                    .user(id)
                    .get()
                    .then(user =>
                      this.setState(state => {
                        let users = state.users;
                        users.set(id, user);
                        return { users: users };
                      }),
                    );
                });
              },
            );
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .allCollaborators()
          .get()
          .then(allCollaborators => {
            this.setState(
              {
                allCollaborators: SummaryView.getContributions(
                  allCollaborators,
                ),
              },
              () => {
                this.state.allCollaborators.forEach((contributions, id) => {
                  Api()
                    .subscribe(SUMMARY_KEY)
                    .user(id)
                    .get()
                    .then(user =>
                      this.setState(state => {
                        let users = state.users;
                        users.set(id, user);
                        return { users: users };
                      }),
                    );
                });
              },
            );
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .problem(this.props.problemId)
          .stages()
          .get()
          .then(stages => {
            stages.sort((a, b) => a.order - b.order);
            this.setState({
              stageNames: stages.reduce(
                (map, stage) => map.set(stage.id, stage.name),
                new Map(),
              ),
            });
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .allLinksBefore()
          .get()
          .then(publications => {
            let unique = new Set();

            publications = publications.filter(
              publication =>
                !unique.has(publication.id) && unique.add(publication.id),
            );

            this.setState({ allPublications: publications });
          });

        Api()
          .subscribe(SUMMARY_KEY)
          .publication(this.props.publicationId)
          .tags()
          .get()
          .then(tags => this.setState({ tags: tags.map(tag => tag.tag) }));
      },
    );
  }

  componentDidUpdate(oldProps) {
    if (oldProps.publicationId !== this.props.publicationId) {
      this.fetchPublicationData();
    }
  }
  render() {
    // TODO: handle cases where publication may not have loaded?
    if (this.state.publication === undefined) {
      return null;
    }

    const mainResourcePresent =
      this.state.resources !== undefined && this.state.resources.length > 0;
    const stagePresent = this.state.stage !== undefined;
    const reviewPresent = this.state.publication.review;

    let metadata = null;

    if (
      this.state.publication !== {} &&
      stagePresent &&
      this.state.resources !== undefined
    ) {
      metadata = this.state.schema.map(([key, type, title, description], i) => {
        let datum = this.state.publication.data[i];

        if (datum === undefined) {
          return null;
        }

        let content;

        switch (type) {
          case "file":
            datum = this.state.resources.find(
              resource => resource.id === datum,
            );

            if (datum === undefined) {
              return null;
            }

            content = (
              <a className="ui button" href={datum.uri}>
                <i className="ui download icon" />
                Download document
              </a>
            );
            break;
          case "uri":
            datum = this.state.resources.find(
              resource => resource.id === datum,
            );

            if (datum === undefined) {
              return null;
            }

            content = <a href={datum.uri}>{datum.uri}</a>;
            break;
          case "text":
            content = datum;
            break;
          case "bool":
            content = (
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  checked={datum}
                  style={{ cursor: "default" }}
                  disabled
                />
                <label> </label>
              </div>
            );
            break;
          default:
            return null;
        }

        return (
          <section key={key} className="ui segment">
            <h3>{title}</h3>
            {description ? (
              <div style={{ marginTop: "-0.5rem" }}>{description}</div>
            ) : null}
            <div className="ui divider" />
            {content}
          </section>
        );
      });
    }

    let allCollaborators =
      this.state.allCollaborators &&
      SummaryView.sortByLastName(this.state.allCollaborators, this.state.users);

    let stagedPublications = null;

    if (
      this.state.allPublications !== undefined &&
      this.state.stageNames !== undefined
    ) {
      stagedPublications = [];

      let first = true;

      this.state.stageNames.forEach((name, stage) => {
        let publications = this.state.allPublications.filter(
          publication => publication.stage === stage,
        );

        if (publications.length <= 0) {
          return;
        }

        publications.sort((a, b) => a.title.localeCompare(b.title));

        let stagePublications = (
          <div key={stage} id={`/stages/${stage}`}>
            {!first ? <span /> : null}
            <h4>
              {name}
              {" ("}
              {publications.length}
              {")"}
            </h4>
            {publications.map(publication => (
              <p key={publication.id}>
                <LocalizedLink
                  to={generateLocalizedPath(RouterURI.Publication, {
                    id: publication.id,
                  })}
                >
                  {publication.title}
                </LocalizedLink>
              </p>
            ))}
          </div>
        );

        stagedPublications.push(stagePublications);

        first = false;
      });
    }

    return (
      <div class="summaryView">
        <div className="ui divider" />
        <main className="ui main text">
          <sidebar>
            <h2>Ratings</h2>
            {this.renderRatings()}
            <br /><br />
            {this.renderRatingButton()}
          </sidebar>

          <article>
            <h1 className="ui header">
              <StageTitle>
                {stagePresent && this.state.stage.singular}
                <ReviewTitle>{reviewPresent ? " Review" : ""}</ReviewTitle>
                {(stagePresent || reviewPresent) && ": "}
              </StageTitle>
              {this.state.publication.title}
            </h1>
            <p>
              <strong>Date added: </strong>
              {new Date(this.state.publication.created_at).toLocaleDateString()}
            </p>
            <br />
            {this.state.collaborators &&
              SummaryView.sortByLastName(
                this.state.collaborators,
                this.state.users,
              ).map(user => (
                <p key={user.id}>
                  <strong>Author: </strong>
                  <a href={`https://orcid.org/${user.orcid}`}>
                    {user.display_name}
                  </a>
                </p>
              ))}
            {mainResourcePresent && (
              <a className="ui button" href={this.state.resources[0].uri}>
                <i className="ui download icon" />
                Download document
              </a>
            )}
            <section className="ui segment">
              <h3>Summary</h3>
              <div className="ui divider" />
              {this.state.publication.summary}
            </section>
            <section className="ui segment">
              <h3>Editor data</h3>
              <div className="ui divider" />
              <div
                dangerouslySetInnerHTML={{
                  __html: this.state.publication.editorData,
                }}
                style={{ maxHeight: 1000, overflow: "auto" }}
              />
            </section>
            <section className="ui segment">
              <h3>Keywords</h3>
              <div className="ui divider" />
              {this.state.tags && (
                <TagSelector tags={this.state.tags} index={0} />
              )}
            </section>
            <section className="ui segment">
              <h3>Funding Statement</h3>
              <div className="ui divider" />
              {this.state.publication.funding}
            </section>
            <section className="ui segment">
              <h3>Conflict of Interest Declaration</h3>
              <div className="ui divider" />
              {this.state.publication.conflict}
            </section>
            {metadata}
            {mainResourcePresent ? (
              <section className="ui segment">
                <PDFImagePreviewRenderer document={this.state.resources[0]} />
              </section>
            ) : (
              <section className="ui placeholder segment">
                <div className="ui icon header">
                  <i className="pencil icon" />
                  No resources were uploaded for this publication.
                </div>
              </section>
            )}
            <section className="ui segment">
              <h3>All collaborating authors in this line of research</h3>
              <div className="ui divider" />
              {this.state.allCollaborators &&
                allCollaborators.map((user, i) => (
                  <span key={user.id}>
                    <a href={`https://orcid.org/${user.orcid}`}>
                      {user.display_name}
                    </a>
                    {user.contributions > 1 ? ` (${user.contributions})` : null}
                    {i + 1 < allCollaborators.length ? ", " : null}
                  </span>
                ))}
            </section>
            <section className="ui segment">
              <h3>Earlier publications in this line of research</h3>
              <div className="ui divider" />
              {stagedPublications}
            </section>
          </article>
        </main>
      </div>
    );
  }
}

const styles = {
  rateReview: {
    color: "green",
    cursor: "pointer",
  },
  reviewRatingContainer: {
    fontSize: 30,
  },
};

const StageTitle = styled.span`
  color: var(--octopus-theme-publication);
`;

const ReviewTitle = styled.span`
  color: var(--octopus-theme-review);
`;

export default withState(SummaryView);
