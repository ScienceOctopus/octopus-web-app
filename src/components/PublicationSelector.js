import Axios from "axios";
import Publication from "./Publication";
import React, { Component } from "react";
import PropTypes from "prop-types";

class PublicationSelector extends Component {
  numSelected = 0;

  constructor(props) {
    super(props);
    this.state = { publications: [] };

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
  }

  fetchPublications() {
    const apiRquest =
      "/api/problems/" +
      this.props.problemId +
      "/stages/" +
      this.props.stageId +
      "/publications";

    console.log(apiRquest);

    Axios.get(apiRquest)
      .then(res => {
        this.pubsContainer.current.scrollLeft = 0;

        this.setState({
          publications: res.data,
          selected: Array(res.data.length).fill(false),
        });
      })
      .catch(err => console.error(err.response));
  }

  handleProblemClick = index => () => {
    let selected = this.state.selected;
    selected[index] = !selected[index];

    this.setState({ selected });

    if (selected[index]) {
      this.numSelected++;
      if (this.numSelected === 1 && this.props.onSelect) this.props.onSelect();
    } else {
      this.numSelected--;
      if (this.numSelected < 1 && this.props.onNoSelection)
        this.props.onNoSelection();
    }
  };

  getSelectedPublications() {
    return this.state.publications.filter((_, i) => this.state.selected[i]);
  }

  render() {
    return (
      <div style={styles.container}>
        <h4>Select basis of your publication</h4>
        <div style={styles.pubsContainer} ref={this.pubsContainer}>
          {this.state.publications.map((x, i) => (
            <Publication
              publication={x}
              highlight={this.state.selected[i]}
              onClick={this.handleProblemClick(i)}
              key={i}
            />
          ))}
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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "80%",
    minWidth: "80%",
    // marginBottom: 10,
    // background: "red",
  },
  pubsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    overflowY: "hidden",
    justifyContent: "space-between",
  },
};

export default PublicationSelector;
