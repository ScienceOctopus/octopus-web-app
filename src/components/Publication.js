import React, { Component } from "react";
import { Link } from "react-router-dom";
/*<<<<<<< HEAD
import { withRouter } from "react-router";

class Publication extends Component {
  render() {
    let backgroundStyle = { ...style };
    if (this.props.highlight) Object.assign(backgroundStyle, highlightedStyle);
    if (this.props.onClick !== undefined)
      Object.assign(backgroundStyle, selectableStyle);

    let publicationView = (
      <div
        className="ui segment"
        style={backgroundStyle}
        onClick={this.props.onClick}
      >
        <h5
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {this.props.publication.title}
        </h5>
        <div className="meta">{this.props.publication.created_at}</div>
        <div className="description fade">
          {this.props.publication.description}
        </div>
      </div>
=======*/

class Publication extends Component {
  render() {
    let backgroundStyle = { ...style };
    if (this.props.publication.id === this.props.content.publication) {
      Object.assign(backgroundStyle, highlightedStyle);
    }
    if (this.props.onClick !== undefined) {
      Object.assign(backgroundStyle, selectableStyle);
    }

    return (
      <Link
        to={{
          pathname: `/publications/${this.props.publication.id}`,
          state: this.props.content,
        }}
        style={{ marginBottom: 0.5 + "em" }}
      >
        <div
          className="ui segment"
          style={backgroundStyle}
          onClick={this.props.onClick}
        >
          <h5
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {this.props.publication.title}
          </h5>
          <div className="meta">{this.props.publication.created_at}</div>
          <div className="description fade">
            {this.props.publication.description}
          </div>
        </div>
      </Link>
      //>>>>>>> routing
    );

    /*    return this.props.isHyperlink
      ? this.linkToPublication(publicationView)
      : publicationView;*/
  }
}

const style = {
  fontSize: 0.75 + "rem",
  paddingBottom: 0,
  //marginBottom: 0.5 + "em",
};

const highlightedStyle = {
  background: "lightgreen",
};

const selectableStyle = {
  cursor: "pointer",
};

export default Publication;
