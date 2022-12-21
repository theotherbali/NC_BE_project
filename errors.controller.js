exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status)
    .send({ message: err.message });
  } else {
    next(err)
  };
}

exports.error404Handler = (req, res, next) => {
  res.status(404).send({ message: "not found" });
};

exports.sqlErrorHandler = (err, req, res, next) => {
  if (err.code === '22P02'|| err.code === '23502') {
    res.status(400).send({ message: 'invalid request' });
  } else if (err.code === '23503'){
    res.status(404).send({message: 'not found'})
  }
  else next(err);
};

exports.error500Handler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("internal server error");
};
