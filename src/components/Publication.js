import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

class Publication extends Component {
  render() {
    let backgroundStyle = { ...style };
    if (this.props.highlight) Object.assign(backgroundStyle, highlightedStyle);
    if (this.props.onClick !== undefined)
      Object.assign(backgroundStyle, selectableStyle);

    let publicationView = (
      <div
        class="ui segment"
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
        <div class="meta">{this.props.publication.created_at}</div>
        <div class="description fade">{this.props.publication.description}</div>
      </div>
    );

    return this.props.isHyperlink
      ? this.linkToPublication(publicationView)
      : publicationView;
  }

  linkToPublication = Child => {
    return (
      <Link
        to={this.props.match.url + "/publications/" + this.props.publication.id}
      >
        {Child}
      </Link>
    );
  };
}

const style = {
  fontSize: 0.75 + "rem",
  paddingBottom: 0,
  marginBottom: 0.5 + "em",
};

const highlightedStyle = {
  background: "lightgreen",
};

const selectableStyle = {
  cursor: "pointer",
};

export default withRouter(Publication);
