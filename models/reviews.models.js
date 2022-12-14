const db = require("../db/connection");
const { checkExists, getValues } = require("../utils");

exports.selectReviews = (category, sort_by = "created_at", order = "desc") => {
	const orders = ["asc", "desc"];
	if (!orders.includes(order)) {
		return Promise.reject({
			status: 400,
			msg: "Sorry, you inputted something incorrectly",
		});
	}
	const columns = [
		"title",
		"designer",
		"owner",
		"review_body",
		"category",
		"created_at",
		"votes",
	];
	if (!columns.includes(sort_by)) {
		return Promise.reject({
			status: 400,
			msg: `Sorry, you inputted something incorrectly`,
		});
	}

	let queryStr = `SELECT reviews.owner, reviews.title, reviews.review_id,
            reviews.category, reviews.review_img_url,
            reviews.created_at, reviews.votes,
            reviews.designer, COUNT(comments.review_id) ::INT AS comment_count
            FROM reviews
            LEFT JOIN comments
            ON  reviews.review_id = comments.review_id
            `;
	let queryParams = [];
	let validCategories = [];

	return getValues("categories", "slug")
		.then((result) => {
			validCategories = result;
		})
		.then(() => {
			if (category) {
				if (!validCategories.includes(category)) {
					return Promise.reject({
						status: 404,
						msg: `Sorry, ${category} is not a valid category`,
					});
				}
				queryStr += ` WHERE reviews.category = $1`;
				queryParams.push(category);
			}
			queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;
			return db.query(queryStr, queryParams);
		})
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
			`SELECT reviews.owner, reviews.title, reviews.review_id,
            reviews.category, reviews.review_img_url, reviews.review_body,
            reviews.created_at, reviews.votes,
            reviews.designer, COUNT(comments.review_id) ::INT AS comment_count
            FROM reviews
            LEFT JOIN comments
            ON  reviews.review_id = comments.review_id
        	WHERE reviews.review_id = $1
			GROUP BY reviews.review_id;`,
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
	return checkExists("reviews", "review_id", review_id).then(() => {
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
	if (typeof author !== "string" || typeof body !== "string") {
		return Promise.reject({
			status: 400,
			msg: "Sorry, you inputted something incorrectly",
		});
	}
	if (review_id === undefined) {
		return Promise.reject({
			status: 400,
			msg: `Sorry, that's a bad request`,
		});
	}

	return checkExists("users", "username", author).then(() => {
		return checkExists("reviews", "review_id", review_id).then(() => {
			return db
				.query(
					`INSERT INTO comments
        (author, body, review_id)
        VALUES
        ($1, $2, $3)
        RETURNING *;`,
					[author, body, review_id]
				)
				.then((result) => {
					return result.rows[0];
				});
		});
	});
};

exports.updateReviewById = (review_id, change) => {
	const { inc_votes: newVote } = change;
	if (typeof newVote !== "number") {
		return Promise.reject({
			status: 400,
			msg: "Sorry, you inputted something incorrectly",
		});
	}
	if (review_id === undefined) {
		return Promise.reject({
			status: 400,
			msg: `Sorry, that's a bad request`,
		});
	}
	return checkExists("reviews", "review_id", review_id).then(() => {
		return db
			.query(
				`UPDATE reviews
            SET votes = votes + $1
            WHERE review_id = $2 RETURNING *;`,
				[newVote, review_id]
			)
			.then((result) => {
				return result.rows[0];
			});
	});
};
