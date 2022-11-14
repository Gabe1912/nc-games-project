const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controllers");
const { getReviews } = require("./controllers/reviews.controllers");

app.get("/api/categories/", getCategories);
app.get("/api/reviews/", getReviews);

//error handling

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Sorry, route not found :(" });
});
module.exports = app;
