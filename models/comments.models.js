const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
	if (comment_id === undefined) {
		return Promise.reject({
			status: 400,
			msg: `Sorry, that's a bad request`,
		});
	}
	return db
		.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
			comment_id,
		])
		.then((comment) => {
			const result = comment.rows[0];
			if (result === undefined) {
				return Promise.reject({
					status: 404,
					msg: `Sorry, that comment does not exist`,
				});
			}
			// return result;
		});
};
