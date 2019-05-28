const VALID_MIMETYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

const postFeedback = (req, res) => {
  console.log(JSON.stringify(req.body));
  return res.status(200).send({
    status: 200,
    statusText: "Hello World!",
  });
};

const postImage = (req, res) => {
  const ext = req.file.originalname.split('.').pop();

  if (!VALID_MIMETYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid mimetype'
    });
  }

  setTimeout(() => {
    res.status(200).json({
      url: `http://localhost:${PORT}/${req.file.path}.${ext}`
    });
  }, 2000);
};

module.exports = {
  postFeedback,
  postImage
};
