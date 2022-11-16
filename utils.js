const db = require("./db/connection");
const format = require("pg-format");

exports.checkExists = (table, column, value) => {
	if (value === undefined) {
		return Promise.reject({
			status: 404,
			msg: `Sorry, you didn't input anything`,
		});
	}
	const queryStr = format(
		"SELECT * FROM %I WHERE %I = %L;",
		table,
		column,
		value
	);
	return db.query(queryStr).then((res) => {
		if (res.rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: `Sorry, ${value} is not a valid ${column}`,
			});
		}
	});
};
