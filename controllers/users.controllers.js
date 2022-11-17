const { selectUsers } = require("../models/users.models");

exports.getUsers = (req, res) => {
	selectUsers(req.body).then((users) => {
		res.status(200).send({ users });
	});
};
