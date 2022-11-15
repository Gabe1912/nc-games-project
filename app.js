const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controllers");
const {
	getReviews,
	getReviewByID,
} = require("./controllers/reviews.controllers");

app.get("/api/categories/", getCategories);
app.get("/api/reviews/", getReviews);
app.get("/api/reviews/:review_id", getReviewByID);

//error handling
const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
} = require("./errors/index.js");

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Sorry, route not found :(" });
});
module.exports = app;
