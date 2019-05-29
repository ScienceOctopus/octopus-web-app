import React, { Component } from "react";
import "./App.css";

import Header from "./Header";
import StageGraph from "./StageGraph";

import SlackFeedback from "react-slack-feedback";
import OctopusIcon from "./octopus-icon";
import { default as OctopusTheme } from "./octopus-theme";
import axios from "axios";

function sendToServer(payload, success, error) {
  return axios.post('/api/feedback', payload)
    .then(success)
    .catch(error);
}

function uploadImage(image, success, error) {
  var form = new FormData();
  form.append('image', image);

  return axios.post('/api/image', form)
    .then(({ data }) => success(data.url))
    .catch(err => error(err));
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />

        <StageGraph
          problemId={1}
        />

        <SlackFeedback
          theme={OctopusTheme}
          showChannel="false"
          icon={() =>
            <OctopusIcon />
          }
          user="Slim"
          onImageUpload={uploadImage}
          onSubmit={sendToServer}
        />
      </div>
    );
  }
}

export default App;
