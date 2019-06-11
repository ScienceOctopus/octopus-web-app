import React, { Component } from "react";

class SimpleSelector extends Component {
  renderOptions() {
    return this.props.data.map((x, i) => {
      let [display, value] = this.props.accessor(x);

      return (
        <option value={value} key={i}>
          {display}
        </option>
      );
    });
  }

  render() {
    return (
      <div className="field" style={this.props.style}>
        <label>{this.props.title}</label>
        <select
          value={(this.props.value || "").toString()}
          onChange={e =>
            this.props.onSelect && this.props.onSelect(e.target.value)
          }
          disabled={this.props.data.length <= 0}
        >
          <option disabled value={""} key={-1}>
            {this.props.data.length ? "--- Select ---" : "--- Loading ---"}
          </option>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}

export default SimpleSelector;
