const port = process.env.PORT || 3001;
const VALID_MIMETYPES = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const postFeedback = (req, res) => {
  console.log(req.body);
  return res.status(200).send({
    status: 200,
    statusText: "Hello World!",
  });
};

const postImage = (req, res) => {
  // Currently file extension not used
  const ext = req.file.originalname.split(".").pop();

  if (!VALID_MIMETYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: "Invalid mimetype",
    });
  }

  setTimeout(() => {
    res.status(200).json({
      url: `/${req.file.filename}`,
    });
  }, 500);
};

module.exports = {
  postFeedback,
  postImage,
};
