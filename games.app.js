const express = require("express");
const { error404Handler, error500Handler } = require("./errors.controller");
const { getCategories, getReviews, getComments } = require("./games.controller");

const app = express();

app.get("/api");
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)

app.use(error404Handler)
app.use(error500Handler)

module.exports = app