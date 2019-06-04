import React, { Component } from "react";
import PropTypes from "prop-types";

import Publication from "./Publication";

class PublicationSelector extends Component {
  handleProblemClick = index => () => {
    let selection = [...this.props.selection];

    if (this.props.singleSelection) {
      let selected = this.props.selection.findIndex(x => x);

      if (selected === index) {
        return;
      }

      if (selected !== -1) {
        selection[selected] = false;
      }

      selection[index] = true;
    } else {
      selection[index] = !selection[index];
    }

    this.props.onSelection(selection);
  };

  render() {
    return (
      <div className="ui field">
        <label>{this.props.title}</label>
        <div className="ui container">
          <div className="ui stackable grid">
            {this.props.publications.map((publication, i) => (
              <div className="four wide column" key={i}>
                <Publication
                  publication={publication}
                  highlight={this.props.selection[i]}
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
  title: PropTypes.string.isRequired,
  singleSelection: PropTypes.bool,
  publications: PropTypes.array.isRequired,
  selection: PropTypes.array.isRequired,
  onSelection: PropTypes.func.isRequired,
};

export default PublicationSelector;
