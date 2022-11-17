const db = require("../db/connection");
const { checkExists } = require("../utils");

exports.selectUsers = () => {
	return db.query(`SELECT * FROM users;`).then((users) => users.rows);
};
