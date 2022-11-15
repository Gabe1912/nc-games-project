const db = require("../db/connection");

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
            GROUP BY reviews.owner, reviews.title, reviews.review_id,
            reviews.category, reviews.review_img_url,
            reviews.created_at, reviews.votes,
            reviews.designer
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
        WHERE review_id = $1`,
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
