const db = require("./db/connection");
const format = require("pg-format");

exports.checkExists = (table, column, value) => {
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

exports.getValues = (table, column) => {
	let output = [];
	return db.query(`SELECT ${column} FROM ${table}`).then((results) => {
		for (let i = 0; i < results.rows.length; i++) {
			output.push(Object.values(results.rows[i])[0]);
		}
		return output;
	});
};
