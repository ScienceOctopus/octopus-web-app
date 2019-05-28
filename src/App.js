import React, { Component } from "react";
import "./App.css";
import DefaultAppView from "./DefaultAppView";
import SlackFeedback from "react-slack-feedback";
import OctopusIcon from "./octopus-icon";
import { default as OctopusTheme } from "./octopus-theme";

function sendToServer(payload, success, error) {

  console.log(JSON.stringify(payload));

  return fetch('/api/slack', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(success)
  .catch(error);
}

function uploadImage(image, success, error) {
  var form = new FormData();
  form.append('image', image);

  return fetch('/api/upload', { method: 'POST', data: form })
    .then(({ url }) => success(url))
    .catch(err => error(err));
}

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <DefaultAppView />
        {/* <ReferenceSelection />
        <ReferenceSelection /> */}

        <SlackFeedback
          theme={OctopusTheme}
          showChannel="false"
          icon={() =>
            <OctopusIcon />
          }
          user="Slim"
          onImageUpload={(image, success,error) =>
            uploadImage(image)
              .then(({ url }) => success(url))
              .catch(error)
          }
          onSubmit={(payload, success, error) =>
            sendToServer(payload)
              .then(success)
              .catch(error)
          }
        />
      </div>
    );
  }
}

export default App;
