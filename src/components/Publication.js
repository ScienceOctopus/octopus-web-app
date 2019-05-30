import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

class Publication extends Component {
  render() {
    return (
      <Link
        to={this.props.match.url + "/publications/" + this.props.publication.id}
        style={{ marginBottom: 0.5 + "em" }}
      >
        <div
          class="ui segment"
          style={{ fontSize: 0.75 + "rem", paddingBottom: 0 }}
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
          <div class="description fade">
            {this.props.publication.description}
          </div>
        </div>
      </Link>
    );
  }
}

export default withRouter(Publication);
