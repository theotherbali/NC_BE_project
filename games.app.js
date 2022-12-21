const express = require("express");
const { error404Handler, error500Handler, customErrorHandler, sqlErrorHandler } = require("./errors.controller");
const { getCategories, getReviews, getReviewsByID, getCommentsByRevID, postComment, patchReviewVoteCount } = require("./games.controller");

const app = express();

app.use(express.json());

app.get("/api");
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewsByID)
app.get("/api/reviews/:review_id/comments", getCommentsByRevID)
app.post("/api/reviews/:review_id/comments", postComment)
app.patch("/api/reviews/:review_id", patchReviewVoteCount)

app.use(customErrorHandler)
app.use(error404Handler)
app.use(sqlErrorHandler)
app.use(error500Handler)

module.exports = app