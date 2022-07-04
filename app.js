const express = require("express");
const { getCategories, getReviewId } = require("./controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewId);

app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Path" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err) console.log(err);
  res.status(500).send({ message: "this is a server problem" });
});

module.exports = app;
