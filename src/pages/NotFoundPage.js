import React, { Component } from "react";

class NotFoundPage extends Component {
  render() {
    return (
      <main className="ui text container">
        <h1>Not Found</h1>

        <p>
          Something has gone wrong and you have tried to access a non-existent
          resource. If you got here from a link on this site, please report it
          as a bug using the feedback form (present at the bottom-right of your
          screen).
        </p>

        <br />
      </main>
    );
  }
}

export default NotFoundPage;
