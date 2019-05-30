import React, { Component } from "react";

class SummaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publication: props.publicationId,
    };

    fetch(
      `/api/publications/${this.state.publication}/`
    )
      .then(response => response.json())
      .then(publication => {
        this.setState({ publication: publication });
      });
  }

  render() {
    return (
      <div>
      <div class="ui divider"></div>
      <main class="ui main container">
      <article>
      <h1 class="ui header"><span style={{color: "#00b5ad"}}>Hypothesis: </span>
      {this.state.publication.title}
      <div class="ui sub header">{ this.state.publication.summary }</div>
      </h1>
      <p>
      <strong>Date added: </strong>{ new Date(this.state.publication.created_at).toLocaleDateString() }
      </p>
      <section class="ui segment"><h3>Summary</h3>
      <div class="ui divider"></div>
      { this.state.publication.description }
      </section>
      <section class="ui segment"><h3>Document</h3>
      <object width="500" height="500" type="application/pdf" data="https://arxiv.org/ftp/arxiv/papers/1905/1905.12599.pdf">
          <p>Embedding failure</p>
      </object>
      </section>
      </article>
      </main>
      </div>
    );
  }
}

export default SummaryView;
