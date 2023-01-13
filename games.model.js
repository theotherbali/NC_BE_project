const db = require("./db/connection");



exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((results) => results.rows);
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then((results) => results.rows)
}

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      const user = result.rows[0]
      if (!user) {
        return Promise.reject({
          status: 404,
          message: "no user found with that id"
        })
      }
      return user
    });
}


exports.selectReviews = ({ sort_by="created_at", order="ASC", category}) => {

    let queryStr = `SELECT reviews.* ,
    COUNT(comment_id) AS comment_count
          FROM reviews
          LEFT JOIN comments ON comments.review_id = reviews.review_id`;


    const allowed_sortby = ["title", "review_id", "category", "comment_count", "created_at", "votes", "designer"]
    const allowed_order =['asc', 'desc', 'ASC', 'DESC']

    if(!allowed_sortby.includes(sort_by) || !allowed_order.includes(order)){
      return Promise.reject({ status: 400, message: 'Invalid query' })
    }

    const queryValues = []

    if (category) {
      queryStr += ` WHERE category = $1`
      queryValues.push(category)
    }

    queryStr += ` GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order};`

  return db
    .query(queryStr, queryValues)
    .then((results) => {
      return results.rows;
    });
  }


exports.selectReviewsByID = (id) => {
  return db
    .query(
      `SELECT reviews.*,
      COUNT(comment_id) AS comment_count
            FROM reviews
            LEFT JOIN comments ON comments.review_id = reviews.review_id
            WHERE reviews.review_id = $1
            GROUP BY reviews.review_id
            ORDER BY created_at DESC;`
      , [id])
    .then((result) => {
      const review = result.rows[0]
      if (!review) {
        return Promise.reject({
          status: 404,
          message: "no reviews found with that id"
        })
      }
      return review
    });
};

exports.selectCommentsByRevID = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [id])
    .then((result) => {
      const comments = result.rows
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: "no comments found with that id"
        })
      }
      return comments
    })
}

exports.insertNewComment = (id, comment) => {
  const username = comment.username
  const text = comment.body
  return db
    .query(`INSERT INTO comments
  (review_id, author, body)
  VALUES
  ($1, $2, $3) returning *`, [id, username, text])
    .then((result) => {
      const newComment = result.rows[0]
      return newComment
    })
}

exports.updateVoteCount = (id, inc_votes) => {

  return db
    .query(`UPDATE reviews SET 
  votes = votes + $1
  WHERE
  review_id = $2
  RETURNING *`, [inc_votes, id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "no reviews found with that id"
        })
      }
      return result.rows[0]
    })
}