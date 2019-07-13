const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const expressWs = require("express-ws");
const wsConnectHandler = require("./lib/webSocket").connect;

const usersHandlers = require("./routes/users");
const problemsHandlers = require("./routes/problems");
const publicationsHandlers = require("./routes/publications");
const orcidAuthHandlers = require("./routes/auth/orcid");

const fb = require("./feedback");

const blobService = require("./lib/blobService");
const upload = blobService.upload;
blobService.initialise();

const app = express();
expressWs(app);

const pino = require('express-pino-logger')();
app.use(pino);

const port = process.env.PORT || 3001;

global.sessions = [];
global.subscriptions = new Map();

// Can access anything in this folder
// app.use(express.static("public"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get("/api", (req, res) => {
  res.send("Welcome to the Octopus API!");
});
app.ws("/api", wsConnectHandler);

app.use("/api/problems", problemsHandlers.router);
app.use("/api/publications", publicationsHandlers.router);
app.use("/api/users", usersHandlers.router);
app.use("/api/auth/orcid", orcidAuthHandlers.router);

app.post("/api/feedback", fb.postFeedback);
app.post(
  "/api/image",
  upload(blobService.AZURE_FEEDBACK_IMAGE_CONTAINER).single("image"),
  fb.postImage,
);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("500 Internal Server Error");
});

app.use(function(req, res, next) {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Octopus API is running on port ${port}.`);
});
