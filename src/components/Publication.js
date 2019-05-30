import React, { Component } from "react";

class Publication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publication: props.publicationId,
      content: {
        title: <wbr />,
        created_at: <wbr />,
        description: <wbr />,
      },
    };

    fetch(`/api/publications/${this.state.publication}`)
      .then(response => response.json())
      .then(content => {
        content.created_at = new Date(content.created_at).toDateString();
        this.setState({ content: content });
      });
  }

  render() {
    return (
      <a
        href={"/publications/" + this.state.publication}
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
            {this.state.content.title}
          </h5>
          <div class="meta">{this.state.content.created_at}</div>
          <div class="description">{this.state.content.description}</div>
        </div>
      </a>
    );
  }
}

export default Publication;
