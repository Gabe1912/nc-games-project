const db = require("../db/connection");

exports.selectReviews = () => {
	return db
		.query(
			`SELECT reviews.owner, reviews.title, reviews.review_id,
            reviews.category, reviews.review_img_url,
            reviews.created_at, reviews.votes,
            reviews.designer, counts.comment_count
            FROM reviews
            LEFT JOIN (
                SELECT review_id, COUNT(review_id) AS comment_count
                FROM comments GROUP BY review_id) AS counts
            ON counts.review_id = reviews.review_id
            ORDER BY created_at DESC;`
		)
		.then((reviews) => reviews.rows);
};
