const { selectReviews } = require("../models/reviews.models");

exports.getReviews = (req, res) => {
	selectReviews(req.body).then((reviews) => {
		res.status(200).send({ reviews });
	});
};
