const {
	selectReviews,
	selectReviewByID,
	selectComments,
	insertReviewComment,
	updateReviewById,
} = require("../models/reviews.models");

exports.getReviews = (req, res, next) => {
	selectReviews(req.body)
		.then((reviews) => {
			res.status(200).send({ reviews });
		})
		.catch(next);
};

exports.getReviewByID = (req, res, next) => {
	selectReviewByID(req.params.review_id)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch(next);
};

exports.getComments = (req, res, next) => {
	selectComments(req.params.review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postReviewComment = (req, res, next) => {
	insertReviewComment(req.params.review_id, req.body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

exports.patchReviewById = (req, res, next) => {
	const change = req.body;
	updateReviewById(req.params.review_id, change)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch(next);
};
