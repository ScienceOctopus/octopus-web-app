import React from "react";

const SortField = props => {
  let containerClass = "ui search item";
  if (props.loading) {
    containerClass += " loading";
  }
  if (props.className) {
    containerClass += ` ${props.className}`;
  }

  return (
    <div className={containerClass}>
      <form onSubmit={props.onSubmit}>
        Sort by :
        <div class="ui selection dropdown">
          <input type="hidden" type="text" placeholder="Enter weight.." />
          {/* <div class="menu">
            <div className="item" data-value="1">
              Male
            </div>
            <div className="item" data-value="0">
              Female
            </div>
          </div> */}
          <div class="ui basic label">
            <div>
              <i className="angle up icon" />
            </div>
            <div>
              <i className="angle down icon" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SortField;
