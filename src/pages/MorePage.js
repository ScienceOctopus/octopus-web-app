import React, { Component } from "react";
import OctopusLogo from "../components/OctopusLogo";

class MorePage extends Component {
  render() {
    return (
      <main className="ui text container">
        <h1 className="ui center aligned icon header">
          <OctopusLogo style={{ width: "1em" }} className="icon" />
          More about Octopus
        </h1>
        <aside className="ui horizontal segments">
          <div className="ui segment">
            <p>
              <strong>
                Scientific knowledge should not be locked behind paywalls, or
                only available to those who can read and write in English.
              </strong>
            </p>
          </div>
          <div className="ui segment">
            <p>
              <strong>
                Scientific ideas and findings should be shared as quickly as
                possible.
              </strong>
            </p>
          </div>
          <div className="ui segment">
            <p>
              <strong>
                Scientific work should be judged on its merits, and not on how
                good a ‘story’ it tells: and so should scientific researchers.
              </strong>
            </p>
          </div>
        </aside>

        <p>
          These principles underlie the design of Octopus: a new way to share
          scientific work that recognises and rewards good practice, and serves
          the needs of both scientists and science itself.
        </p>
        <p>
          In Octopus, then, you publish work in smaller units than a ‘paper’.
          You can write and share one of 8 kinds of publication (though we are
          building the infrastructure to support custom types for different
          fields and research types):
        </p>
        <ul>
          <li>Problem – a neatly defined scientific problem</li>
          <li>
            Hypothesis – an original hypothesis relating to an existing
            published Problem
          </li>
          <li>
            Method/Protocol – a practical method of testing an existing
            published Hypothesis
          </li>
          <li>
            Data/Results – raw data or summarised results collected according to
            an existing published Method (can be linked to a data repository)
          </li>
          <li>
            Analysis – a statistical or thematic analysis of existing published
            Data or Results
          </li>
          <li>
            Interpretation – a discussion around an existing published Analysis
          </li>
          <li>
            Translation/Application – ‘real world’ applications arising from an
            existing published Interpretation
          </li>
          <li>
            Review – a considered, detailed review of any of the above kinds of
            publication
          </li>
        </ul>

        <p>
          Every publication in Octopus must be linked to another existing
          publication in order to form ordered chains. Only Problems and Reviews
          can be linked to any of the first publication types – others must be
          linked only to a type directly above them in the ‘chain’:
        </p>

        <img
          className="ui fluid image"
          alt="Graph of the connections between publication stages"
          src="/images/Publishing Flow.png"
        />

        <p>
          Anyone can read anything on Octopus. Those logged in with an ORCID can
          write and rate publications.
        </p>

        <p>
          Every publication you write (including reviews) can be rated by
          others, and these will add to your individual page which is available
          for all individuals, institutions and funding bodies to see.
          Publishing quickly and well, and good collaborative reviewing is
          therefore rewarded.
        </p>

        <br />
      </main>
    );
  }
}

export default MorePage;
