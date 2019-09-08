import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SearchList from "../components/SearchList";

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getQuery() {
    return new URLSearchParams(this.props.location.search).get("q");
  }

  render() {
    return (
      <div className="ui main container">
        <SearchList query={this.getQuery()} />
      </div>
    );
  }
}

export default withRouter(SearchPage);
