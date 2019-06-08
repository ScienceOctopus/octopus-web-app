import React, { Component } from "react";
import SlackFeedback from "react-slack-feedback";

import { OctopusIcon } from "./octopus-icon";
import { default as OctopusTheme } from "./octopus-theme";
import Api from "../../api";

function sendToServer(payload, success, error) {
  return Api()
    .feedback()
    .post(payload)
    .then(success)
    .catch(error);
}

function uploadImage(image, success, error) {
  var form = new FormData();
  form.append("image", image);

  return Api()
    .image()
    .post(form)
    .then(({ data }) => success(data.url))
    .catch(err => error(err));
}

const icon = () => <OctopusIcon />;

export default class OctopusSlackFeedback extends Component {
  render() {
    return (
      <SlackFeedback
        ref={ref =>
          ref &&
          ref.SlackFeedback.current.children[1].style.setProperty(
            "background-color",
            "#30947e",
          )
        }
        theme={OctopusTheme}
        showChannel="false"
        user="Slim"
        icon={icon}
        onImageUpload={uploadImage}
        onSubmit={sendToServer}
      />
    );
  }
}
