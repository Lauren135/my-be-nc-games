const connection = require("./db/connection");

exports.selectCategories = () => {
  return connection.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};

exports.selectReviewId = (reviewId) => {
  if (typeof reviewId === undefined) {
    return Promise.reject({
      msg: "Bad request",
      status: 400,
    });
  }

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
  console.log(typeof update);
  if (typeof update === "string") {
    return Promise.reject({
      msg: "Bad request",
      status: 400,
    });
  }
  return connection
    .query(
      `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *`,
      [reviewId, update]
    )
    .then((result) => {
      return result.rows;
    });
};