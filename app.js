const express = require("express");
const { getCategories } = require("./controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Path" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err) console.log(err);
  res.status(500).send({ message: "this is a server problem" });
});

module.exports = app;
