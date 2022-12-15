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
