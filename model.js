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

exports.selectReviews = (category, sort_by = "created_at", order = "DESC") => {
  const validSortBy = [
    "review_id",
    "title",
    "review_body",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC", "asc", "desc"];
  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({
      msg: "Bad request",
      status: 400,
    });
  }
  if (!category) {
    return connection
      .query(
        `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id 
    GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`
      )
      .then((result) => {
        return result.rows;
      });
  } else if (category) {
    return connection
      .query(`SELECT * FROM categories WHERE slug = $1`, [category])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            msg: "Bad request",
            status: 400,
          });
        }
      })
      .then(() => {
        return connection.query(
          `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews
      LEFT JOIN comments ON comments.review_id = reviews.review_id 
      WHERE category = $1 
      GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`,
          [category]
        );
      })
      .then((result) => {
        return result.rows;
      });
  }
};

exports.selectReviewComments = (reviewId) => {
  return connection
    .query(
      `SELECT * FROM reviews
      WHERE review_id = $1`,
      [reviewId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          msg: "Review ID not found",
          status: 404,
        });
      }
    })
    .then(() => {
      return connection.query(
        `SELECT * FROM comments
        WHERE review_id = $1`,
        [reviewId]
      );
    })
    .then((result) => {
      return result.rows;
    });
};
exports.insertReviewComments = (review_id, username, body) => {
  return connection
    .query(
      `SELECT * FROM reviews
      WHERE review_id = $1`,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          msg: "Review ID not found",
          status: 404,
        });
      }
    })
    .then(() => {
      return connection.query(
        `SELECT * FROM comments
        WHERE author = $1`,
        [username]
      );
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          msg: "Bad request",
          status: 400,
        });
      }
    })
    .then(() => {
      return connection.query(
        `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
        [review_id, username, body]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};
exports.removeCommentById = (comment_id) => {
  return connection
    .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
    .then(({ rowCount }) => {
      console.log(rowCount);
      if (rowCount === 0) {
        return Promise.reject({
          msg: `Comment_id does not exist`,
          status: 404,
        });
      }
      return;
    });
};
