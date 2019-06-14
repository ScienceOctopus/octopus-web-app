import React from "react";

const withState = Child => {
  class ChildWithState extends Child {
    componentDidMount() {
      this._isMounted = true;

      if (this._setStateTask !== undefined) {
        let task = this._setStateTask;
        this._setStateTask = undefined;

        task();
      }

      if (super.componentDidMount) super.componentDidMount();
    }

    componentWillUnmount() {
      this._isMounted = false;

      if (super.componentWillUnmount) super.componentWillUnmount();
    }

    setState(newState, callback) {
      let task = () => this.setState(newState, callback);

      if (this._isMounted === true) {
        super.setState(newState, callback);
      } else if (this._setStateTask === undefined) {
        this._setStateTask = task;
      } else {
        let oldTask = this._setStateTask;

        this._setStateTask = () => {
          oldTask();
          task();
        };
      }
    }
  }

  return ChildWithState;
};

export default withState;
