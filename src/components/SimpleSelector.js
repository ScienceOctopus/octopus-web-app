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
      <div style={style.container}>
        <label style={style.label}>{this.props.title}</label>
        <select
          style={style.input}
          defaultValue={""}
          onChange={e =>
            this.props.onSelect &&
            this.props.onSelect(
              e.target.value,
              [...e.target.children]
                .find(x => x.value === e.target.value)
                .getAttribute("first") === "true",
            )
          }
        >
          {this.state.loaded ? this.renderOptions() : "Not loaded yet"}
        </select>
      </div>
    );
  }
}

const style = {
  container: {
    width: "15rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    margin: "0.5em",
  },
  label: {
    display: "block",
    fontSize: "0.9em",
    fontWeight: 700,
  },
  input: {
    lineHeight: "1.2em",
    padding: "0.66em 1em",
    fontSize: "1em",
    border: "1px solid lightgrey",
    borderRadius: "0.3rem",
    boxShadow: "0 0 0 0 transparent inset",
    transition: "color .1s ease,border-color .1s ease",
  },
};

const emptyOption = (
  <option disabled selected value key={-1}>
    {"---select---"}
  </option>
);

export default SimpleSelector;
