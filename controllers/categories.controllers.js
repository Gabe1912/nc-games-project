const { selectCategories } = require("../models/categories.models");

exports.getCategories = (req, res) => {
	selectCategories(req.body).then((categories) => {
		res.status(200).send({ categories });
	});
};
