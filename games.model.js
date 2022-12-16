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
      `SELECT reviews.*, 
      COUNT(comment_id) AS comment_count
            FROM reviews
            LEFT JOIN comments ON comments.review_id = reviews.review_id
            WHERE reviews.review_id = $1
            GROUP BY reviews.review_id;`, [parseInt(id)])
    .then((result) => {
      return result.rows[0];
    });
};

