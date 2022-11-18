const express = require("express");
const app = express();
app.use(express.json());
const { getCategories } = require("./controllers/categories.controllers");
const {
	getReviews,
	getReviewByID,
	getComments,
	postReviewComment,
	patchReviewById,
	getReviewByCategory,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");

app.get("/api/categories/", getCategories);
app.get("/api/reviews/", getReviews);
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postReviewComment);
app.patch("/api/reviews/:review_id", patchReviewById);
app.get("/api/users/", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentById);
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
