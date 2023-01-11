const db = require("./db/connection");
const categories = require("./db/data/test-data/categories")

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

exports.selectReviews = (body) => {
  if (Object.keys(body).length === 0 ) {
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
  } else {
    let queryStr = `SELECT reviews.* ,
    COUNT(comment_id) AS comment_count
          FROM reviews
          LEFT JOIN comments ON comments.review_id = reviews.review_id`

    const sort_by = body.sort_by
    const order = body.order
    const category = body.categories

    const allowed_sortby = ["title", "review_id", "category", "review_img_url", "created_at", "votes", "designer"]
    const allowed_categories = []

    categories.forEach((category) => {
      allowed_categories.push(category.slug)
    })
    
    if(body.categories){
      if (allowed_categories.includes(category)) {
        queryStr += ` WHERE category = '${category}'`
      } else {
        return Promise.reject({ status: 400, message: 'Invalid query' });
      }
}
    if (body.sort_by) {
      if (allowed_sortby.includes(sort_by)) {
        queryStr += ` GROUP BY reviews.review_id
        ORDER BY ${sort_by}`
        if (body.order) {
          if (['asc', 'desc', 'ASC', 'DESC'].includes(order)) {
            queryStr += ` ${order};`
          } else {
            return Promise.reject({ status: 400, message: 'Invalid query' });
          }
        }
      } else {
        return Promise.reject({ status: 400, message: 'Invalid query' })
      }
    } else {
      queryStr += `GROUP BY reviews.review_id
      ORDER BY created_at DESC;`
    }
    
    return db
      .query(queryStr)
      .then((results) => {
        return results.rows;
      });
  }
};


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
    .query(`SELECT * FROM comments WHERE review_id = $1`, [id])
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