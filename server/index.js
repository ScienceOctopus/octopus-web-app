const express = require("express");
const bodyParser = require("body-parser");

const db = require("./postgresQueries").queries;

const problemsHandlers = require("./routes/problems");

const fb = require("./feedback");
const multer = require("multer");
const MulterAzureStorage = require("multer-azure-storage");

const blobService = require("./blobService.js");
blobService.initialise();

const app = express();
const port = process.env.PORT || 3001;

// Can access anything in this folder
app.use(express.static("public"));
app.use(express.static("feedback"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/api", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/api/", problemsHandlers.router);

const upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName: blobService.AZURE_FEEDBACK_IMAGE_CONTAINER,
    containerSecurity: "blob",
  }),
});

app.post("/api/feedback", fb.postFeedback);
app.post("/api/image", upload.single("image"), fb.postImage);

//app.post("/api/pdf2html", pdfToHtml);

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
