const express = require("express");
const expressWs = require("express-ws");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const db = require("./postgresQueries").queries;

const wsConnectHandler = require("./webSocket").connect;

const usersHandlers = require("./routes/users");
const problemsHandlers = require("./routes/problems");
const publicationsHandlers = require("./routes/publications");
const OAuthFlowResponseHandlers = require("./routes/oauth-flow");

const fb = require("./feedback");
const multer = require("multer");
const MulterAzureStorage = require("multer-azure-storage");

const blobService = require("./blobService.js");
const upload = blobService.upload;
blobService.initialise();

const app = express();
const wss = expressWs(app).getWss();

const port = process.env.PORT || 3001;

const noop = () => {};

const wss_interval = setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

global.sessions = [];
global.subscriptions = new Map();

// Can access anything in this folder
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get("/api", (req, res) => {
  res.send("Welcome to the Octopus API (Node.js)!");
});
app.ws("/api", wsConnectHandler);

app.use("/api/problems", problemsHandlers.router);
app.use("/api/publications", publicationsHandlers.router);
app.use("/api/users", usersHandlers.router);
app.use("/api/oauth-flow", OAuthFlowResponseHandlers.router);

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
  console.log(`Octopus API (Node.js) is running on port ${port}.`);
});
