import React, { Component } from "react";

import Publication from "./Publication";

class Stage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePublication: props.activePublicationId,
      activeStage: props.activeStageId,
      problem: props.problemId,
      stage: props.stage,
      publications: [],
      links: [],
      ref: undefined,
    };
    this._next = undefined;
    this._queries = [];
    this._nextPublications = [];

    fetch(
      `/api/problems/${this.state.problem}/stages/${
        this.state.stage.id
      }/publications`,
    )
      .then(response => response.json())
      .then(publications => {
        while (this._queries.length) {
          this._queries.pop()(publications);
        }

        this.setState({ publications: publications });

        this.constructLinks();
      });
  }

  setNext(next) {
    if (this._next !== undefined || next === undefined) {
      return;
    }

    this._next = next;

    this._next.queryPublications(publications => {
      this._nextPublications = publications;

      this.constructLinks();
    });
  }

  queryPublications(query) {
    if (this.state.publications.length) {
      query(this.state.publications);
    } else {
      this._queries.push(query);
    }
  }

  constructLinks() {
    if (!this.state.publications.length || !this._nextPublications.length) {
      return;
    }

    let links = [];
    let counter = 0;

    this._nextPublications.forEach(nextPublication => {
      fetch(`/api/publications/${nextPublication.id}/references`)
        .then(response => response.json())
        .then(references => {
          // TODO: actually use references test data

          this.state.publications.forEach(publication => {
            links.push([publication, nextPublication]);
          });

          if (++counter >= this._nextPublications.length) {
            this.setState({
              links: links.map(([to, from]) => [
                this.state.publications.findIndex(x => x === to),
                this._nextPublications.findIndex(x => x === from),
              ]),
            });
          }
        });
    });
  }

  callback(me, ref) {
    if (ref && ref !== me.state.ref) {
      me.setState({ ref: ref });
    }
  }

  render() {
    var active = this.state.activeStage === this.state.stage.id;
    return (
      <div class="column">
        <div className={"ui " + (active ? "raised " : "") + "segment"}>
          <h4>
            {this.state.stage.name}
            <div className={"floating ui " + (active ? "teal " : "") + "label"}>
              {this.state.publications.length}
            </div>
          </h4>
          {this.state.publications.map(publication => (
            <Publication
              activePublicationId={this.state.activePublication}
              publicationId={publication.id}
            />
          ))}
        </div>
        {/* {links} */}
      </div>
    );
  }
}

export default Stage;
