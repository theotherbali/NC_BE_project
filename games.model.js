const db = require("./db/connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((results) => results.rows);
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.*,
      COUNT(comment_id) AS comment_count
            FROM reviews
            LEFT JOIN comments ON comments.review_id = reviews.review_id
            GROUP BY reviews.review_id
            ORDER BY created_at DESC;`
    )
    .then((results) => {
      return results.rows;
    });
};


exports.selectReviewsByID = (id) => {
  return db
    .query(
      `SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then((result) => {
      const review = result.rows[0]
      if(!review){
        return Promise.reject ({
          status: 404,
          message: "no reviews found with that id"
      })
    }
    return review
  });
};

exports.selectCommentsByRevID = (id) => {
  return db
  .query(`SELECT * FROM comments WHERE review_id = $1`, [id])
  .then((result) => {
    const comments = result.rows
    console.log(comments.length)
      if(comments.length === 0){
        return Promise.reject ({
          status: 404,
          message: "no comments found with that id"
      })
  }
  return comments
})
}

