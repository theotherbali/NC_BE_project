const { selectGamesByCategory } = require("./games.model");

exports.getCategories = (req, res) => {
  selectGamesByCategory().then((games) => {
  res.status(200).send(games)
});
};
