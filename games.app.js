const express = require("express");
const { getCategories, error404handler, error500handler } = require("./games.controller");
const app = express();

app.get("/api");
app.get("/api/categories", getCategories);


app.use(error404handler)
app.use(error500handler)

module.exports = app