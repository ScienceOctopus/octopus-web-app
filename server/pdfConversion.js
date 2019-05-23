const PUB_FOLDER = "public/";
const TEST_HTML_PATH = "convertedHtmls/sample.html";

const pdfToHtml = (request, response) => {
  var pdftohtml = require("pdftohtmljs");

  let pathToPdf = request.body.source;
  let pathToHtml = PUB_FOLDER + TEST_HTML_PATH;

  var converter = new pdftohtml(pathToPdf, pathToHtml);

  converter
    .convert("default")
    .then(() => {
      console.log("Successfully converted to " + pathToHtml);
      rewriteOutputHtml(pathToHtml);
    })
    .catch(err => {
      console.error("Conversion error: " + err);
    });

  converter.progress(function(ret) {
    console.log(ret.current * 100.0 / ret.total + " %");
  });

  response.status(200).json(TEST_HTML_PATH);
};

const rewriteOutputHtml = pathToHtml => {
  const fs = require("fs");
  fs.readFile(pathToHtml, "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    let result = rewriteHtmlData(data);
    fs.writeFile(pathToHtml, result, "utf8", function(err) {
      if (err) return console.log(err);
    });
  });
};

const rewriteHtmlData = data => {
  return data
    .replace(/(::selection{.*})|(::-moz-selection{.*})/g, "")
    .replace(/#page-container{position:absolute/g, "#page-container{");
};

module.exports = {
  pdfToHtml,
};
