import React, { Component } from "react";
import Api from "../api";
import SearchDescription from "./SearchDescription";

const SEARCH_KEY = "search";

class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      stages: [],
      filters: [],
      sort: "",
    };

    // Always start a new cache when the search page is loaded
    Api().subscribeClass(SEARCH_KEY, Math.random());
  }

  componentDidMount() {
    this.fetchQuery();
  }

  componentWillUnmount() {
    Api().unsubscribeClass(SEARCH_KEY);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.query !== this.props.query) {
      this.fetchQuery();
    }
  }

  completedQuery({ problems, publications }) {
    const getCount = id => publications.filter(p => p.problem === id).length;

    // Results
    this.setState(
      {
        loading: false,
        items: [
          ...problems.map(x => ({
            ...x,
            type: "problem",
            count: getCount(x.id),
          })),
          ...publications.map(x => ({
            ...x,
            type: "publication",
            count: getCount(x.id),
          })),
        ],
      },
      this.loadingComplete,
    );
  }

  completedStages(apiStages) {
    const stages = [{ name: "All", id: 0 }, ...apiStages];
    const filters = [true];
    this.setState({ stages, filters });
  }

  fetchQuery() {
    this.setState({
      loading: true,
    });

    this.fetchStages();

    if (!this.props.query) {
      this.fetchAll();
    } else {
      this.fetchByQuery();
    }
  }

  fetchStages() {
    Api()
      .problem("")
      .stages()
      .get()
      .then(items => this.completedStages(items));
  }

  fetchByQuery() {
    Api()
      .problems()
      .publications()
      .getQuery(this.props.query)
      .then(items => this.completedQuery(items));
  }

  fetchAll() {
    Api()
      .problems()
      .publications()
      .get()
      .then(items => this.completedQuery(items));
  }

  renderNothingFound() {
    return (
      <div className="ui icon header">
        <i className="search icon"></i>
        We don't have any documents matching your query
      </div>
    );
  }

  renderList(list) {
    const { stages } = this.state;

    if (!list.length) {
      return this.renderNothingFound();
    }

    return (
      <div className="ui middle aligned divided list">
        {list.map(x => (
          <SearchDescription
            item={x}
            stage={stages.find(s => x.stage === s.id)}
            key={`${x.type}${x.id}`}
            onSelect={this.props.onSelect}
          />
        ))}
      </div>
    );
  }

  applyFilter(id) {
    let filters = this.state.filters;

    if (id) {
      filters[id] = !filters[id];
      filters[0] = false;
    } else {
      filters = [true];
    }

    this.setState({ filters });
  }

  applySort(sort) {
    const { items: oldItems } = this.state;
    let items = [...oldItems];

    const compare = (property, asc) => (a, b) =>
      a[property] > b[property] ? (asc ? 1 : -1) : asc ? -1 : 1;

    switch (sort) {
      case "a-to-z":
        items.sort(compare("title", true));
        break;
      case "z-to-a":
        items.sort(compare("title", false));
        break;
      case "up-created":
        items.sort(compare("created_at", true));
        break;
      case "down-created":
        items.sort(compare("created_at", false));
        break;
      case "up-updated":
        items.sort(compare("updated_at", true));
        break;
      case "down-updated":
        items.sort(compare("updated_at", false));
        break;
      default:
    }

    this.setState({ sort, items });
  }

  renderCheckBox(title, id, checked = false, onChange) {
    const identifier = `filter-${title}-${id}`;
    return (
      <div className="ui checkbox">
        <input
          type="checkbox"
          name={identifier}
          id={identifier}
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor={identifier} style={styles.pointer}>
          {title}
        </label>
      </div>
    );
  }

  renderRadio(title, type, checked = false) {
    const identifier = `filter-${type}`;
    return (
      <div className="ui radio checkbox">
        <input
          type="radio"
          name={identifier}
          id={identifier}
          checked={checked}
          onChange={() => this.applySort(type)}
        />
        <label htmlFor={identifier} style={styles.pointer}>
          {title}
        </label>
      </div>
    );
  }

  renderFilter(title, items) {
    return (
      <div className="item">
        <div className="content">
          <div className="header">{title}</div>
          <div className="list">
            {items.map((item, index) => (
              <div className="item" key={index}>
                <div className="content">
                  <div className="description">{item}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  renderFiltersLoader(categories, items) {
    return (
      <div>
        {[...Array(categories)].map((p, index) => (
          <div key={index}>
            <div className="ui placeholder">
              <div className="paragraph">
                <div className="line"></div>
              </div>
              <div className="paragraph">
                {[...Array(items)].map((l, index) => (
                  <div className="line" key={index}></div>
                ))}
              </div>
            </div>
            {(categories > 1 && index !== categories - 1 && (
              <div className="ui divider"></div>
            )) ||
              null}
          </div>
        ))}
      </div>
    );
  }

  renderFilters() {
    const { stages } = this.state;
    return (
      <div className="ui segment">
        <div className="ui list">
          {(!stages.length && this.renderFiltersLoader(1, 7)) ||
            this.renderFilter(
              "Type",
              stages.map(({ name, id }) =>
                this.renderCheckBox(name, id, this.state.filters[id], () =>
                  this.applyFilter(id),
                ),
              ),
            )}
        </div>
      </div>
    );
  }

  renderSort() {
    const { sort, stages } = this.state;
    return (
      <div className="ui segment">
        <div className="ui list">
          {(!stages.length && this.renderFiltersLoader(3, 2)) || (
            <span>
              {this.renderFilter("Title", [
                this.renderRadio("A to Z", "a-to-z", sort === "a-to-z"),
                this.renderRadio("Z to a", "z-to-a", sort === "z-to-a"),
              ])}

              <div className="ui divider"></div>
              {this.renderFilter("Created", [
                this.renderRadio(
                  "Oldest to newest",
                  "down-created",
                  sort === "down-created",
                ),
                this.renderRadio(
                  "Newest to oldest",
                  "up-created",
                  sort === "up-created",
                ),
              ])}

              <div className="ui divider"></div>
              {this.renderFilter("Updated", [
                this.renderRadio(
                  "Oldest to newest",
                  "down-updated",
                  sort === "down-updated",
                ),
                this.renderRadio(
                  "Newest to oldest",
                  "up-updated",
                  sort === "up-updated",
                ),
              ])}
            </span>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { items, filters, loading } = this.state;

    const list =
      filters.length > 1 ? items.filter(item => filters[item.stage]) : items;

    const classes = {
      loading: loading ? "loading" : "",
      placeholder: list.length && !loading ? "" : "placeholder",
    };

    return (
      <div className="ui stackable two column grid">
        <div className="five wide tablet three wide computer column">
          {this.renderFilters()}
          {this.renderSort()}
        </div>
        <div className="eleven wide tablet thirteen wide computer column">
          <div
            className={`ui ${classes.loading} ${classes.placeholder} basic segment`}
            style={{ borderColor: "white!important" }}
          >
            {loading ? null : this.renderList(list)}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  pointer: {
    cursor: "pointer",
  },
};

export default SearchList;
