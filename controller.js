const {
  selectCategories,
  selectReviewId,
  selectUsers,
  updateReview,
  selectReviewById,
  selectReviews,
} = require("./model");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewId(reviewId)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.changeReview = (req, res, next) => {
  const { inc_votes } = req.body;
  const { review_id } = req.params;
  updateReview(review_id, inc_votes)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.updatedReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};
