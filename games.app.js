const express = require("express");
const { getCategories } = require("./games.controller");
const app = express();

app.get("/api");
app.get("/api/categories", getCategories);

module.exports = app