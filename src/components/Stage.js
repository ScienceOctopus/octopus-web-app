import React, { Component } from "react";

import Publication from "./Publication";

class Stage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      }/publications`
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
    let links = null;

    if (this.state.links.length && this.state.ref) {
      let cntBB = this.state.ref.getBoundingClientRect();
      let pubBB = this.state.ref.firstChild.children[1].getBoundingClientRect();

      let height = pubBB.bottom - pubBB.top;
      let margin = pubBB.top - cntBB.top;

      console.log(height, margin);

      let length = Math.max(
        this.state.publications.length,
        this._nextPublications.length
      );

      let paths = this.state.links.map(([from, to]) => {
        let begin = (from * 100) / length + 50 / length;
        let end = (to * 100) / length + 50 / length;

        return (
          <path
            d={
              "M 0 " + begin + " C 50 " + begin + ", 50 " + end + ", 100 " + end
            }
            style={{ stroke: "#00726c", strokeWidth: 2, fill: "transparent" }}
            vectorEffect="non-scaling-stroke"
          />
        );
      });

      links = (
        <div
          style={{
            width: 0,
            padding: 0,
            zIndex: 999,
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <div
            style={{
              width: 60 + "px",
              height: height * length + "px",
              marginLeft: -30 + "px",
              marginTop: margin + "px",
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {paths}
            </svg>
          </div>
        </div>
      );
    }

    return (
      <div class="column" ref={ref => this.callback(this, ref)}>
        <div class="ui segment">
          <h4>
            {this.state.stage.name}
            <div class="floating ui label">
              {this.state.publications.length}
            </div>
          </h4>
          {this.state.publications.map(publication => (
            <Publication publicationId={publication.id} />
          ))}
        </div>
        {links}
      </div>
    );
  }
}

export default Stage;
