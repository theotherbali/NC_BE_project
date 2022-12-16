const express = require("express");
const { error404Handler, error500Handler, error400Handler } = require("./errors.controller");
const { getCategories, getReviews, getReviewsByID } = require("./games.controller");

const app = express();

app.get("/api");
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewsByID)

app.use(error404Handler)
app.use(error400Handler)
app.use(error500Handler)

module.exports = app