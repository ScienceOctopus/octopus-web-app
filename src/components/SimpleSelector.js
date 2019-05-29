import Axios from "axios";
import React, { Component } from "react";

class SimpleSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
  }

  componentDidMount() {
    Axios.get(this.props.url)
      .then(res =>
        this.setState({ data: res.data, loaded: res.data.length > 0 })
      )
      .catch(console.error);
  }

  renderOptions() {
    let options = this.state.data.map((x, i) => (
      <option value={x.id} key={i}>
        {x.title || x.name}
      </option>
    ));
    options.unshift(emptyOption);
    return options;
  }

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <select
          defaultValue={""}
          onChange={e =>
            this.props.onSelect && this.props.onSelect(e.target.value)}
        >
          {this.state.loaded ? this.renderOptions() : "Not loaded yet"}
        </select>
      </div>
    );
  }
}

const emptyOption = (
  <option disabled selected value key={-1}>
    {"---select---"}
  </option>
);

export default SimpleSelector;
