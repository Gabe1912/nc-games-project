const db = require("../db/connection");
const { checkReviewExists } = require("../utils");

exports.selectReviews = () => {
	return db
		.query(
			`SELECT reviews.owner, reviews.title, reviews.review_id,
            reviews.category, reviews.review_img_url,
            reviews.created_at, reviews.votes,
            reviews.designer, COUNT(comments.review_id) ::INT AS comment_count
            FROM reviews
            LEFT JOIN comments
            ON  reviews.review_id = comments.review_id
            GROUP BY reviews.review_id
            ORDER BY created_at DESC;`
		)
		.then((reviews) => reviews.rows);
};

exports.selectReviewByID = (review_id) => {
	if (review_id === undefined) {
		return Promise.reject({
			status: 400,
			msg: `Sorry, that's a bad request`,
		});
	}
	return db
		.query(
			`SELECT * FROM reviews
        WHERE review_id = $1;`,
			[review_id]
		)
		.then((review) => {
			const result = review.rows[0];
			if (result === undefined) {
				return Promise.reject({
					status: 404,
					msg: `Sorry, that review does not exist`,
				});
			}
			return result;
		});
};

exports.selectComments = (review_id) => {
	return checkReviewExists(review_id).then(() => {
		return db
			.query(
				`SELECT * FROM comments
        WHERE review_id = $1;`,
				[review_id]
			)
			.then((comments) => comments.rows);
	});
};

exports.insertReviewComment = (review_id, newComment) => {
	const { author, body } = newComment;
	const newDate = new Date();
	if (review_id === undefined) {
		return Promise.reject({
			status: 400,
			msg: `Sorry, that's a bad request`,
		});
	}
	return checkReviewExists(review_id).then(() => {
		return db
			.query(
				`INSERT INTO comments
        (author, body, review_id, votes, created_at)
        VALUES
        ($1, $2, $3, 0, $4)
        RETURNING *;`,
				[author, body, review_id, newDate]
			)
			.then((result) => result.rows[0]);
	});
};
