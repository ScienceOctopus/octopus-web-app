const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const expressWs = require("express-ws");
const pino = require("express-pino-logger")();

const usersHandlers = require("./routes/users");
const problemsHandlers = require("./routes/problems");
const publicationsHandlers = require("./routes/publications");
const orcidAuthHandlers = require("./routes/auth/orcid");
const feedbackHandlers = require("./routes/feedback");

const wsConnectHandler = require("./lib/webSocket").connect;
const blobService = require("./lib/blobService");
const upload = blobService.upload;
blobService.initialise();

function noop() {}

// intialise the app
const app = express();
const webSocketInstance = expressWs(app).getWss();

// attach pino logger
app.use(pino);

// terminate abandoned open sockets, 30s interval
setInterval(() => {
  webSocketInstance.clients.forEach(ws => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

const port = process.env.PORT || 3001;

global.sessions = [];
global.subscriptions = new Map();

// Can access anything in this folder
// app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.ws("/api", wsConnectHandler);

app.get("/api", (req, res) => {
  res.send("Welcome to the Octopus API!");
});

app.use("/api/problems", problemsHandlers.router);
app.use("/api/publications", publicationsHandlers.router);
app.use("/api/users", usersHandlers.router);
app.use("/api/auth/orcid", orcidAuthHandlers.router);

app.post("/api/feedback", feedbackHandlers.postFeedback);
app.post("/api/image", upload().single("image"), feedbackHandlers.postImage);

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
