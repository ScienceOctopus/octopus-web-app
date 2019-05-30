import React, { Component } from "react";

class Publication extends Component {
  render() {
    return (
      <a
        href={"/publications/" + this.props.publication.id}
        style={{ marginBottom: 0.5 + "em" }}
      >
        <div class="ui segment" style={{ fontSize: 0.75 + "rem" }}>
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
          <div class="description">{this.props.publication.description}</div>
        </div>
      </a>
    );
  }
}

export default Publication;
