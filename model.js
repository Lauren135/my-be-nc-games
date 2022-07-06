const connection = require("./db/connection");

exports.selectCategories = () => {
  return connection.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};

exports.selectReviewId = (reviewId) => {
  return connection
    .query("SELECT * FROM reviews WHERE review_id = $1", [reviewId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          msg: "Review ID not found",
          status: 404,
        });
      } else {
        return result.rows;
      }
    });
};

exports.updateReview = (reviewId, update) => {
  return connection
    .query(
      `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *`,
      [reviewId, update]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectUsers = () => {
  return connection.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};

exports.selectReviewById = (reviewId) => {
  return connection
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id 
      WHERE reviews.review_id = $1 GROUP BY reviews.review_id`,
      [reviewId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          msg: "Review ID not found",
          status: 404,
        });
      } else {
        return result.rows;
      }
    });
};

exports.selectReviews = () => {
  return connection
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id 
       GROUP BY reviews.review_id ORDER BY reviews.created_at`
    )
    .then((result) => {
      return result.rows;
    });
};
