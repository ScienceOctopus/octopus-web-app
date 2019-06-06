import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="ui inverted footer basic segment">
        <div className="ui center aligned container">
          <h4 className="ui inverted header">In partnership with...</h4>
          <div className="ui images">
            <a href="https://royalsociety.org">
              <img
                alt="Logo of the Royal Society"
                src="/images/The Royal Society.png"
                className="ui tiny image"
              />
            </a>
            <a href="https://elifesciences.org">
              <img
                alt="Logo of the eLIFE organisation"
                src="/images/eLIFE.svg"
                className="ui small image"
              />
            </a>
            <a href="https://science.mozilla.org">
              <img
                alt="Logo of the Mozilla Science Lab"
                src="/images/mozilla Science Lab.svg"
                className="ui small image"
              />
            </a>
            <a href="http://www.dcn.ed.ac.uk/camarades/ukrn">
              <img
                alt="Logo of the UK Reproducibility Network"
                src="/images/UKRN.png"
                className="ui tiny image"
              />
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
