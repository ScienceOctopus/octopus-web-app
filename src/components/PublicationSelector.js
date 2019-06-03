import Axios from "axios";
import Publication from "./Publication";
import React, { Component } from "react";
import PropTypes from "prop-types";

class PublicationSelector extends Component {
  numSelected = 0;

  constructor(props) {
    super(props);
    this.state = {
      publications: [],
      initialSelection: this.props.selectedPublications,
    };

    this.pubsContainer = React.createRef();

    this.fetchPublications();
  }

  componentDidUpdate(prev) {
    if (
      this.props.problemId !== prev.problemId ||
      this.props.stageId !== prev.stageId
    ) {
      this.fetchPublications();
    }

    if (this.props.singleSelection !== prev.singleSelection) {
      this.numSelected = 0;
      this.setState({ selection: this.emptySelection() });
      if (this.props.onNoSelection) this.props.onNoSelection();
    }
  }

  emptySelection() {
    return Array(this.state.publications).fill(false);
  }

  fetchPublications() {
    const apiRquest =
      "/api/problems/" +
      this.props.problemId +
      "/stages/" +
      this.props.stageId +
      "/publications";

    Axios.get(apiRquest)
      .then(res => {
        this.pubsContainer.current.scrollLeft = 0;

        res.data.forEach(
          publication =>
            (publication.created_at = new Date(
              publication.created_at,
            ).toLocaleDateString()),
        );

        let initialSelection = new Set(
          this.state.initialSelection.map(id => Number(id)),
        );

        this.setState({
          publications: res.data,
          selected: res.data.map(publication =>
            initialSelection.has(publication.id),
          ),
          initialSelection: [],
        });
      })
      .catch(err => console.error(err.response));
  }

  handleProblemClick = index => () => {
    let selected = this.props.singleSelection
      ? this.emptySelection()
      : this.state.selected;

    selected[index] = !selected[index];

    this.setState({ selected });

    if (selected[index]) {
      if (!this.props.singleSelection || this.numSelected === 0)
        this.numSelected++;
      if (this.numSelected === 1 && this.props.onSelect) this.props.onSelect();
    } else {
      if (!this.props.singleSelection) this.numSelected--;
      if (this.numSelected < 1 && this.props.onNoSelection)
        this.props.onNoSelection();
    }
  };

  getSelectedPublications() {
    return this.state.publications.filter((_, i) => this.state.selected[i]);
  }

  render() {
    return (
      <div className="ui field">
        <label>
          {this.props.singleSelection
            ? "Which publication are you reviewing?"
            : "Which publications should yours be linked to?"}
        </label>
        <div className="ui container">
          <div className="ui stackable grid" ref={this.pubsContainer}>
            {this.state.publications.map((x, i) => (
              <div className="four wide column" key={i}>
                <Publication
                  publication={x}
                  highlight={this.state.selected[i]}
                  onClick={this.handleProblemClick(i)}
                  pointer={!this.props.singleSelection}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

PublicationSelector.propTypes = {
  problemId: PropTypes.string.isRequired,
  stageId: PropTypes.number.isRequired,
  onNoSelection: PropTypes.func,
  onSelect: PropTypes.func,
};

export default PublicationSelector;
