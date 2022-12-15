exports.error404Handler = (req, res, next) => {
  res.status(404).send({ message: "path not found" });
};

exports.error500Handler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("internal server error");
};
