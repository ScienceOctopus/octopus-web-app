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
      rewriteOutputHtml(pathToHtml).then(() => {
        console.log("HTML Responding");
        response.status(200).json(TEST_HTML_PATH);
      });
    })
    .catch(err => {
      console.error("Conversion error: " + err);
    });

  converter.progress(function(ret) {
    console.log(ret.current * 100.0 / ret.total + " %");
  });
};

const rewriteOutputHtml = async pathToHtml => {
  const fs = require("fs");

  let content = null;
  try {
    content = fs.readFileSync(pathToHtml, "utf8");
  } catch (err) {
    console.error(err);
    return;
  }

  let result = rewriteHtmlData(content);
  console.log("HTML Writing");

  try {
    fs.writeFileSync(pathToHtml, result, "utf8");
  } catch (err) {
    console.error(err);
  }
};

const rewriteHtmlData = data => {
  return data
    .replace(/(::selection{.*})|(::-moz-selection{.*})/g, "")
    .replace(/#page-container{position:absolute/g, "#page-container{");
};

module.exports = {
  pdfToHtml,
};
