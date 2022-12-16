exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status)
    .send({ message: err.message });
  } else {
    next(err)
  };
}

exports.error404Handler = (req, res, next) => {
  res.status(404).send({ message: "path not found" });
};

exports.error400Handler = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ message: 'invalid request' });
  } else next(err);
};

exports.error500Handler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("internal server error");
};
