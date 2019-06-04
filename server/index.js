const express = require("express");
const bodyParser = require("body-parser");

const db = require("./postgresQueries").queries;

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
const port = process.env.PORT || 3001;

// Can access anything in this folder
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/api", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/api/problems", problemsHandlers.router);
app.use("/api/publications", publicationsHandlers.router);
app.use("/api/oauth-flow", OAuthFlowResponseHandlers.router);

app.post("/api/feedback", fb.postFeedback);
app.post(
  "/api/image",
  upload(blobService.AZURE_FEEDBACK_IMAGE_CONTAINER).single("image"),
  fb.postImage
);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("500 Internal Server Error");
});

app.use(function(req, res, next) {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
  // db.getProblems();
});

//const pino = require('express-pino-logger')();
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(pino);

//app.get('/api/greeting', (req, res) => {
//  const name = req.query.name || 'World';
//  res.setHeader('Content-Type', 'application/json');
//  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
//});

//app.listen(3001, () =>
//  console.log('Express server is running on localhost:3001')
//);
