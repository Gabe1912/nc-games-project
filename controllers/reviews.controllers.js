const {
	selectReviews,
	selectReviewByID,
	selectComments,
} = require("../models/reviews.models");

exports.getReviews = (req, res) => {
	selectReviews(req.body).then((reviews) => {
		res.status(200).send({ reviews });
	});
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
