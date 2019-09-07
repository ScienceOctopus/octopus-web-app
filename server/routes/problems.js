const express = require("express");

const db = require("../postgresQueries").queries;
const blobService = require("../lib/blobService");
const upload = blobService.upload;
const getUserFromSession = require("../lib/userSessions").getUserFromSession;
const broadcast = require("../lib/webSocket").broadcast;

const fs = require("fs");

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  };
}

const getProblemsByQuery = async (req, res) => {
  const problems = await db.selectProblemsBySearch(req.query.q);

  res.status(200).json(problems);
};

const getProblems = async (req, res) => {
  if (req.query && req.query.q) {
    await getProblemsByQuery(req, res);
    return;
  }

  const problems = await db.selectAllProblems();

  res.status(200).json(problems);
};

const getProblemByID = async (req, res) => {
  const problems = await db.selectProblemsByID(req.params.id);

  if (!problems.length) {
    console.log(`Couldn't find problem with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  if (problems.length > 1) {
    console.error("Found multiple problems with same ID!");
    return res.sendStatus(500);
  }

  return res.status(200).json(problems[0]);
};

const getStagesByProblem = async (req, res) => {
  const problems = await db.selectProblemsByID(req.params.id);
  if (!problems.length) {
    console.log(`Couldn't find problem with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }
  const stages = await db.selectStagesByProblem(req.params.id);

  res.status(200).json(stages);
};

const getStageByProblem = async (req, res) => {
  const problems = await db.selectProblemsByID(req.params.id);
  if (!problems.length) {
    return res.sendStatus(404);
  }

  const stages = await db.selectStagesByID(req.params.stage);
  if (!stages.length) {
    console.log(`Couldn't find stage: ${req.params.stage}`);
    return res.sendStatus(404);
  }

  res.status(200).json(stages[0]);
};

const getPublicationsByProblemAndStage = async (req, res) => {
  const problems = await db.selectProblemsByID(req.params.id);
  if (!problems.length) {
    console.log(`Couldn't find problem with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const stages = await db.selectStagesByID(req.params.stage);
  if (!stages.length) {
    return res.sendStatus(404);
  }

  let publications = await db.selectOriginalPublicationsByProblemAndStage(
    req.params.id,
    req.params.stage,
  );

  // TODO: refactor session cookie name into environmental waste
  const sessionUser = getUserFromSession(req);
  if (sessionUser) {
    const additionalPublications =
      (await db.selectOriginalDraftPublicationsByProblemAndStageAndUser(
        req.params.id,
        req.params.stage,
        sessionUser,
      )) || [];

    publications = [...publications, ...additionalPublications];
  }

  res.status(200).json(publications);
};

const getPublicationsByProblem = async (req, res) => {
  const problems = await db.selectProblemsByID(req.params.id);
  if (!problems.length) {
    console.log(`Couldn't find problem with ID: ${req.params.id}`);
    return res.sendStatus(404);
  }

  const publications = await db.selectCompletedPublicationsByProblem(
    req.params.id,
  );

  res
    .status(200)
    .append("X-Total-Count", publications.length)
    .json(publications);
};

const getPublicationCountByProblem = async (req, res) => {
  const count = await db.countCompletedPublicationsForProblem(req.params.id);

  res
    .status(200)
    .append("X-Total-Count", count)
    .end();
};

const postPublicationToProblemAndStage = async (req, res) => {
  if (req.body.__DEBUG__) {
    res.status(200).end();
    return;
  }

  let user = getUserFromSession(req);

  if (!isNumber(req.body.user) || !user || user !== Number(req.body.user)) {
    console.log(`Couldn't find user with ID: ${req.body.user}`);
    return res.sendStatus(400);
  }

  const problems = await db.selectProblemsByID(req.params.id);
  if (!problems.length) {
    console.log(`Couldn't find problem with ID: ${req.params.id}`);
    return res.sendStatus(400);
  }

  const stages = await db.selectStagesByID(req.params.stage);

  if (!stages.length) {
    console.log(`Couldn't find stage: ${req.params.stage}`);
    return res.sendStatus(400);
  }

  if (
    req.body.review === "true" &&
    (req.body.basedOn === undefined || JSON.parse(req.body.basedOn).length <= 0)
  ) {
    console.log(`Review must have a basedOn property`);
    return res.sendStatus(400);
  }

  let data;
  let resources = [];

  if (req.body.review === "true") {
    data = [];
  } else {
    const schema = JSON.parse(stages[0].schema);
    data = JSON.parse(req.body.data);

    if (schema.length !== data.length) {
      console.log(`Schema and data lengths do not match`);
      return res.sendStatus(400);
    }

    for (let i = 0; i < schema.length; i++) {
      let content = data[i];
      let error;

      switch (schema[i][1]) {
        case "file":
          error =
            typeof content !== "number" ||
            content <= 0 ||
            req.files[content] === undefined;
          break;
        case "uri":
          error = typeof content !== "string";
          break;
        case "text":
          error = typeof content !== "string";
          break;
        case "bool":
          error = typeof content !== "boolean";
          break;
        default:
          error = true;
      }

      if (error) {
        return res.sendStatus(400);
      }

      switch (schema[i][1]) {
        case "file":
          // @TODO use a generic model for file operations
          content = (await db.insertResource(
            req.files[0].mimeType,
            req.files[0].location,
          ))[0];

          resources.push(content);
          break;
        case "uri":
          content = (await db.insertResource("uri", content))[0];
          resources.push(content);
          break;
        case "text":
          break;
        case "bool":
          break;
      }

      data[i] = content;
    }
  }

  const publications = await db.insertPublication(
    req.params.id,
    req.params.stage,
    req.body.title,
    req.body.summary,
    req.body.funding,
    req.body.conflict,
    req.body.review,
    JSON.stringify(data),
    true,
  );

  await db.insertPublicationCollaborator(
    publications[0],
    req.body.user,
    "author",
  );

  if (JSON.parse(req.body.review) && !JSON.parse(req.body.isUserPublication)) {
    await db.insertPublicationRatings(
      JSON.parse(req.body.basedOn)[0],
      req.body.quality,
      req.body.sizeOfDataset,
      req.body.correctProtocol,
      req.body.user,
    );
  }
  //   let usersToNotify = [];

  if (req.body.basedOn !== undefined) {
    let basedArray = JSON.parse(req.body.basedOn);
    await db.insertLink(publications[0], basedArray);

    // usersToNotify = await db
    //   .selectAllCollaboratorsForListOfPublications(basedArray)
    //   .map(x => x.user);

    // for (let i = 0; i < usersToNotify.length; i++) {
    //   await db.insertUserNotification(usersToNotify[i], publications[0]);
    // }
  }
  if (req.files.length > 0) {
    resources.unshift(
      (await db.insertResource(
        req.files[0].mimetype,
        req.files[0].location,
      ))[0],
    );
  }

  for (let i = 0; i < resources.length; i++) {
    await db.insertPublicationResource(
      publications[0],
      resources[i],
      i <= 0 ? "main" : "meta",
    );
  }

  const tags = JSON.parse(req.body.tags);

  for (let i = 0; i < tags.length; i++) {
    await db.insertTagToPublication(publications[0], tags[i]);
  }

  // Problem publications changed
  broadcast(`/problems/${req.params.id}/publications`);
  broadcast(
    `/problems/${req.params.id}/stages/${req.params.stage}/publications`,
  );

  // Reviews of linked publication changed
  if (req.body.review === "true") {
    let publication = JSON.parse(req.body.basedOn)[0];

    broadcast(`/publications/${publication}/reviews`);
  }

  // linksAfter of linked publications have changed
  if (req.body.basedOn !== undefined) {
    let basedArray = JSON.parse(req.body.basedOn);

    basedArray.forEach(publication =>
      broadcast(`/publications/${publication}/linksAfter`),
    );
  }

  broadcast(`/users/${user}/signoffs`);

  res.status(200).json(publications[0]);
};

const postProblem = async (req, res) => {
  if (req.body.__DEBUG__ === true) {
    res.status(200).json(1);
    return;
  }

  let user = getUserFromSession(req);

  if (!req.body.title || !user) {
    console.log(`Title or user missing in postProblem routine`);
    return res.sendStatus(400);
  }

  // If no stages were provided, just link all of them
  let stages =
    req.body.stages || (await db.selectAllStagesIds().map(x => x.id));
  if (!stages.length || stages.some(x => !isNumber(x))) {
    console.log(`Stages not found`);
    return res.sendStatus(400);
  }

  let problem = (await db.insertProblem(
    req.body.title,
    req.body.description,
    req.body.user,
  ))[0];

  for (let i = 0; i < stages.length; i++) {
    await db.insertProblemStage(problem, stages[i], stages[i]);
  }

  broadcast("/problems");

  res.status(200).json(problem);
};

const isNumber = x => Number(x) !== NaN;

const fileToText = async (req, res) => {
  // ge uploaded files bucket and key
  let fileOptions = [];
  req.files.forEach(file => {
    fileOptions.push({
      s3Options: {
        Bucket: file.bucket,
        Key: file.key,
      },
      mimetype: file.mimetype,
    });
  });

  fileOptions.forEach(fileOption => {
    const aws = require("aws-sdk");
    const AWS_KEY = process.env.AWS_KEY;
    const AWS_SECRET = process.env.AWS_SECRET;
    const AWS_REGION = process.env.AWS_REGION;

    aws.config.update({
      region: AWS_REGION,
      accessKeyId: AWS_KEY,
      secretAccessKey: AWS_SECRET,
    });
    const s3Instance = new aws.S3();
    const filePath = `/tmp/V0-${fileOption.s3Options.Key}`;

    try {
      s3Instance.getObject(fileOption.s3Options, (err, data) => {
        if (err) console.error(err);

        // base64 encoding doesn't write corrupted .doc and .docx
        // base64 encoding doesn't affect .pdf
        fs.writeFileSync(filePath, Buffer.from(data.Body).toString("base64"), {
          encoding: "base64",
        });

        if (fileOption.mimetype === "application/msword") {
        }

        if (fileOption.mimetype === "text/x-tex") {
        }

        if (
          fileOption.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          // ------ works for DOCX ------
          const mammoth = require("mammoth");
          mammoth
            .convertToHtml({ path: filePath })
            .then(function(result) {
              var html = result.value; // The generated HTML
              res.status(200).json({ html });
            })
            .done();
        }

        // ------ works for PDF ------
        if (fileOption.mimetype === "application/pdf") {
          var extract = require("pdf-html-extract");

          extract(filePath, function(err, html) {
            if (err) {
              console.dir(err);
              return;
            }

            html.join(" ");
            res.status(200).json({ html });
          });
        }
      });
    } catch (err) {
      console.log("err", err);
      res.status(500).send("500 Internal Server Error ");
    }
  });
};

var router = express.Router();
router.post(
  "/file-to-text",
  (req, res, next) => {
    if (upload) {
      return upload().array("file")(req, res, next);
    }
    next();
  },
  catchAsyncErrors(fileToText),
);

router.get("/", catchAsyncErrors(getProblems));
router.post("/", catchAsyncErrors(postProblem));
router.get(
  "/:id(\\d+)/publications",
  catchAsyncErrors(getPublicationsByProblem),
);
router.head(
  "/:id(\\d+)/publications",
  catchAsyncErrors(getPublicationCountByProblem),
);
router.get("/:id", catchAsyncErrors(getProblemByID));
router.get("/:id(\\d+)/stages", catchAsyncErrors(getStagesByProblem));
router.get(
  "/:id(\\d+)/stages/:stage(\\d+)",
  catchAsyncErrors(getStageByProblem),
);
router.get(
  "/:id(\\d+)/stages/:stage(\\d+)/publications",
  catchAsyncErrors(getPublicationsByProblemAndStage),
);

router.post(
  "/:id(\\d+)/stages/:stage(\\d+)/publications",
  (req, res, next) => {
    if (upload) {
      return upload().array("file")(req, res, next);
    }
    next();
  },
  catchAsyncErrors(postPublicationToProblemAndStage),
);

module.exports = {
  getProblems,
  getProblemByID,
  getStagesByProblem,
  getPublicationsByProblemAndStage,
  postPublicationToProblemAndStage,
  router,
};
