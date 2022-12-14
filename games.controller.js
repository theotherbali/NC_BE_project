const { selectCategories } = require("./games.model");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({categories})
});
};

exports.error404handler = (req, res, next) => { 
  res.status(404).send({ message: 'path not found' });
}

exports.error500handler = (err, req, res, next) => {
    console.log(err)
    res.status(500).send('internal server error')
};
