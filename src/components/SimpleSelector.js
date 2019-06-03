import Axios from "axios";
import React, { Component } from "react";

class SimpleSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      value: "",
    };
  }

  componentDidMount() {
    Axios.get(this.props.url)
      .then(res =>
        this.setState({ data: res.data, loaded: res.data.length > 0 }),
      )
      .catch(console.error);
  }

  renderOptions() {
    let options = this.state.data.map((x, i) => (
      <option value={x.id} key={i} first={(i === 0).toString()}>
        {x.title || x.name}
      </option>
    ));
    options.unshift(emptyOption);
    return options;
  }

  render() {
    return (
      <div className="field">
        <label>{this.props.title}</label>
        <select
          value={this.state.value}
          onChange={e => {
            this.setState({ value: e.target.value });

            this.props.onSelect &&
              this.props.onSelect(
                e.target.value,
                [...e.target.children]
                  .find(x => x.value === e.target.value)
                  .getAttribute("first") === "true",
              );
          }}
        >
          {this.state.loaded ? this.renderOptions() : "Not loaded yet"}
        </select>
      </div>
    );
  }
}

const emptyOption = (
  <option disabled value={""} key={-1}>
    {"---select---"}
  </option>
);

export default SimpleSelector;
