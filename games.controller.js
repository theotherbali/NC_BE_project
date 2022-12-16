const {
  selectCategories,
  selectReviews,
  selectReviewsByID,
  selectCommentsByRevID,
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

exports.getReviewsByID = (req, res, next) => {
  const id = req.params.review_id
  selectReviewsByID(id)
  .then((reviews) => {
    res.status(200).send({ reviews })
  })
  .catch(next)
}

exports.getCommentsByRevID = (req, res, next) => {
  const id = req.params.review_id
  selectCommentsByRevID(id)
  .then((comments) => {
    res.status(200).send({ comments })
  })
  .catch(next)
}
