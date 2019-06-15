import React, { Component } from "react";

class TagSelector extends Component {
  static updateFromExternal(prevTags, prevIndex, newTags) {
    let extTags = new Set(newTags);

    let updIndex = prevIndex;

    let updTags = prevTags.filter((tag, i) => {
      if (!extTags.has(tag)) {
        if (i < prevIndex) {
          updIndex -= 1;
        }

        return false;
      }

      return true;
    });

    if (
      newTags.length === prevTags.length &&
      newTags.length === updTags.length
    ) {
      return null;
    }

    let oldTags = new Set(prevTags);

    newTags.forEach(tag => {
      if (!oldTags.has(tag)) {
        updTags.push(tag);
      }
    });

    return { tags: updTags, index: updIndex };
  }

  delimeter = new RegExp(/,|;/, "g");

  removeTagToEdit = () => {
    if (this.ref.value.length > 0 || this.props.index <= 0) {
      return false;
    }

    let tags = [...this.props.tags];
    this.ref.value = tags.splice(this.props.index - 1, 1)[0] + " ";
    this.props.onUpdate(tags, this.props.index - 1);

    return true;
  };

  addTagToList = cursor => {
    let [left, right] = [
      this.ref.value
        .slice(0, cursor)
        .replace(this.delimeter, "")
        .trim(),
      this.ref.value
        .slice(cursor, this.ref.value.length)
        .replace(this.delimeter, "")
        .trim(),
    ];

    this.ref.value = "";

    setTimeout(() => (this.ref.selectionStart = this.ref.selectionEnd = 0), 0);

    if (left.length <= 0 && right.length <= 0) {
      return false;
    }

    if (left.length <= 0) {
      if (this.props.tags.includes(right)) {
        return true;
      }

      let tags = [...this.props.tags];
      tags.splice(this.props.index, 0, right);
      this.props.onUpdate(tags, this.props.index);

      return true;
    }

    this.ref.value = right;

    if (this.props.tags.includes(left)) {
      return true;
    }

    let tags = [...this.props.tags];
    tags.splice(this.props.index, 0, left);
    this.props.onUpdate(tags, this.props.index + 1);

    return true;
  };

  handleTagsKeyDown = e => {
    let cursor =
      this.ref.selectionDirection === "backward"
        ? this.ref.selectionEnd
        : this.ref.selectionStart;

    if (e.key === "Backspace") {
      this.removeTagToEdit();
    } else if (e.key === "Enter") {
      this.addTagToList(cursor);
    } else if (e.key === "," || e.key === ";") {
      this.addTagToList(cursor);

      e.preventDefault();
    } else if (e.key === "Tab") {
      if (this.addTagToList(cursor)) {
        e.preventDefault();
      } else {
        this.props.onUpdate(this.props.tags, this.props.tags.length);
      }
    } else if (e.key === "ArrowLeft" && this.props.index > 0 && cursor <= 0) {
      let value = this.ref.value.replace(this.delimeter, "").trim();

      let tags = [...this.props.tags];
      let index = this.props.index - 1;

      if (value.length > 0 && !this.props.tags.includes(value)) {
        tags.splice(this.props.index, 0, value);
        index = this.props.index;

        e.preventDefault();
      }

      this.ref.value = "";

      this.props.onUpdate(tags, index);
    } else if (
      e.key === "ArrowRight" &&
      this.props.index < this.props.tags.length &&
      cursor >= this.ref.value.length
    ) {
      let value = this.ref.value.replace(this.delimeter, "").trim();

      let tags = [...this.props.tags];

      if (value.length > 0 && !this.props.tags.includes(value)) {
        tags.splice(this.props.index, 0, value);

        e.preventDefault();
      }

      this.ref.value = "";

      this.props.onUpdate(tags, this.props.index + 1);
    }
  };

  render() {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
          paddingLeft: "0.5rem",
          paddingTop: "0.5rem",
          borderRadius: "4px",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {this.props.tags.slice(0, this.props.index).map((tag, i) => (
          <div
            key={i}
            className="ui horizontal label"
            style={{
              display: "flex",
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
            }}
            onClick={
              this.props.input
                ? e => {
                    let value = this.ref.value
                      .replace(this.delimeter, "")
                      .trim();

                    let tags = [...this.props.tags];

                    if (value.length > 0 && !this.props.tags.includes(value)) {
                      tags.splice(this.props.index, 0, value);
                    }

                    this.ref.value = tags[i];
                    tags.splice(i, 1);

                    this.props.onUpdate(tags, i);
                    this.ref.focus();
                  }
                : undefined
            }
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {tag}
            </span>
            {this.props.input ? (
              <i
                className="delete icon"
                onClick={e => {
                  let tags = [...this.props.tags];
                  tags.splice(i, 1);
                  this.props.onUpdate(tags, this.props.index - 1);
                  e.stopPropagation();
                }}
              />
            ) : null}
          </div>
        ))}
        {this.props.input ? (
          <input
            type="text"
            style={{
              border: "none",
              boxShadow: "none",
              display: "flex",
              width: "unset",
              padding: 0,
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
              flexGrow: 1,
            }}
            ref={ref => {
              if (ref) {
                this.ref = ref;
                ref.addEventListener("keydown", this.handleTagsKeyDown);
              }
            }}
          />
        ) : null}
        {this.props.tags
          .slice(this.props.index, this.props.tags.length)
          .map((tag, j) => (
            <div
              key={this.props.index + j}
              className="ui horizontal label"
              style={{
                display: "flex",
                marginRight: "0.5rem",
                marginBottom: "0.5rem",
              }}
              onClick={
                this.props.input
                  ? () => {
                      let value = this.ref.value
                        .replace(this.delimeter, "")
                        .trim();

                      let tags = [...this.props.tags];

                      this.ref.value = tags[this.props.index + j];
                      tags.splice(this.props.index + j, 1);

                      let index = this.props.index + j;

                      if (
                        value.length > 0 &&
                        !this.props.tags.includes(value)
                      ) {
                        tags.splice(this.props.index, 0, value);
                        index += 1;
                      }

                      this.props.onUpdate(tags, index);
                      this.ref.focus();
                    }
                  : undefined
              }
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {tag}
              </span>
              {this.props.input ? (
                <i
                  className="delete icon"
                  onClick={e => {
                    let tags = [...this.props.tags];
                    tags.splice(this.props.index + j, 1);
                    this.props.onUpdate(tags, this.props.index);
                    e.stopPropagation();
                  }}
                />
              ) : null}
            </div>
          ))}
      </div>
    );
  }
}

export default TagSelector;
