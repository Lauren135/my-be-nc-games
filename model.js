const connection = require("./db/connection");

exports.selectCategories = () => {
  return connection.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};

exports.selectReviewId = (reviewId) => {
  if (reviewId === undefined) {
    return Promise.reject({
      msg: "Bad request",
      status: 400,
    });
  }
  return connection
    .query("SELECT * FROM reviews WHERE review_id = $1", [reviewId])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return Promise.reject({
          msg: "Invalid Path",
          status: 404,
        });
      }
    });
};
