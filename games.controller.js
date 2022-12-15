const {
  selectCategories,
  selectReviews,
  selectReviewsByID,
} = require("./games.model");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewsByID = (req, res) => {
  const id = req.params.review_id
  console.log(id)
  selectReviewsByID(id).then((reviews) => {
    res.status(200).send({ reviews })
  })
}
