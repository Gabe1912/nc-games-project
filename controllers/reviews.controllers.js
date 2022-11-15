const { selectReviews, selectReviewByID } = require("../models/reviews.models");

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
