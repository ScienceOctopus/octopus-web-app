const axios = require("axios");

const VALID_MIMETYPES = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const postFeedback = (req, res) => {
  let message = req.body.attachments[0];

  delete message.author_name;

  message.title =
    message.title.charAt(0).toUpperCase() + message.title.slice(1);

  message.footer = "Octopus Slack Feedback";

  axios.post(process.env.FEEDBACK_WEBHOOK, req.body).then(response => {
    return res.status(response.status).send({
      status: response.status,
      statusText: response.statusText,
    });
  });
};

const postImage = (req, res) => {
  if (!VALID_MIMETYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: "Invalid mimetype",
    });
  }

  setTimeout(() => {
    res.status(200).json({
      url: req.file.location,
    });
  }, 500);
};

module.exports = {
  postFeedback,
  postImage,
};
