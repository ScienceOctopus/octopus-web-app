import React, { Component } from "react";

class PublicationSearchTemplate extends Component {
  render() {
    return <div>{this.props.publication.title}</div>;
  }
}

export default PublicationSearchTemplate;
