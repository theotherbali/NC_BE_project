const {
  selectCategories,
  selectReviews,
  selectReviewsByID,
  selectCommentsByRevID,
  insertNewComment,
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

exports.postComment = (req, res, next) => {
  const id = req.params.review_id
  const comment = req.body
  insertNewComment(id, comment)
  .then((newComment) => {
    res.status(201).send(newComment)
  })
  .catch(next)
  
}

exports.patchReviewVoteCount = (req, res, next) => {
  const id = req.params.review_id
  const inc_count = req.body
  updateVoteCount(id, inc_count)
  .then((updatedReview) => {
    res.status(200).send(updatedReview)
  })

  
}
