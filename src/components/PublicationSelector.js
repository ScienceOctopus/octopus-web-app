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

  isSelected = i => {
    return this.props.selection && this.props.selection[i];
  };

  render() {
    const selectionProps = i =>
      this.props.selectionEnabled
        ? {
            highlight: this.isSelected(i),
            onClick: this.handleProblemClick(i),
            pointer: !this.isSelected(i) || !this.props.singleSelection,
          }
        : {};

    return (
      <div className="required field">
        {this.props.title && <label>{this.props.title}</label>}

        <div className="ui container" style={{ minHeight: "0.5rem" }}>
          <div className="ui stackable grid">
            {this.props.publications.map((publication, i) => (
              <div className="four wide column" key={i}>
                <Publication publication={publication} {...selectionProps(i)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

PublicationSelector.propTypes = {
  title: PropTypes.string,
  singleSelection: PropTypes.bool,
  publications: PropTypes.array.isRequired,
  selection: PropTypes.array,
  onSelection: PropTypes.func,
};

export default PublicationSelector;
