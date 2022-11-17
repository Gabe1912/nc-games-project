const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
	return seed(data);
});
afterAll(() => {
	return db.end();
});

describe("/api/", () => {
	test("ERROR 404 - route not found", () => {
		return request(app)
			.get("/api/notValidRoute")
			.expect(404)
			.then((result) => {
				expect(result.body).toMatchObject({
					msg: "Sorry, route not found :(",
				});
			});
	});
});
describe("/api/categories", () => {
	test("GET 200 - should return with all the categories", () => {
		return request(app)
			.get("/api/categories/")
			.expect(200)
			.then((result) => {
				expect(result.body.categories.length > 0).toBe(true);
				result.body.categories.forEach((category) => {
					expect(category).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});
describe("/api/reviews", () => {
	test("GET 200 - should return with all the reviews in decending order of date", () => {
		return request(app)
			.get("/api/reviews/")
			.expect(200)
			.then((result) => {
				expect(result.body.reviews.length > 0).toBe(true);
				expect(result.body.reviews).toBeSortedBy("created_at", {
					descending: true,
				});
				result.body.reviews.forEach((review) => {
					expect(review).toMatchObject({
						owner: expect.any(String),
						title: expect.any(String),
						review_id: expect.any(Number),
						category: expect.any(String),
						review_img_url: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						designer: expect.any(String),
						comment_count: expect.any(Number),
					});
				});
			});
	});
});
describe("/api/reviews/:review_id", () => {
	describe("GET /api/reviews/:review_id", () => {
		test("GET 200 - should return an object of the relevant review", () => {
			return request(app)
				.get("/api/reviews/1")
				.expect(200)
				.then((result) => {
					expect(result.body).toMatchObject({
						review: {
							review_id: expect.any(Number),
							title: expect.any(String),
							designer: expect.any(String),
							owner: expect.any(String),
							review_img_url: expect.any(String),
							review_body: expect.any(String),
							category: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
						},
					});
				});
		});
		test("ERROR 400 - should return error message if given an invalid id", () => {
			return request(app)
				.get("/api/reviews/not-a-review")
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, that's a bad request");
				});
		});
		test("ERROR 404 - should return error if given valid id that doesn't exist", () => {
			return request(app)
				.get("/api/reviews/9999")
				.expect(404)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, that review does not exist");
				});
		});
	});
	describe("PATCH /api/reviews/:review_id", () => {
		test("PATCH - 200: should update the votes of a review by increasing by passed value", () => {
			const update = { inc_votes: 3 };
			const output = {
				review_id: 1,
				title: "Agricola",
				designer: "Uwe Rosenberg",
				owner: "mallionaire",
				review_img_url:
					"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
				review_body: "Farmyard fun!",
				category: "euro game",
				created_at: "2021-01-18T10:00:20.514Z",
				votes: 4,
			};
			return request(app)
				.patch("/api/reviews/1")
				.send(update)
				.expect(200)
				.then(({ body }) => {
					expect(body.review).toEqual(output);
				});
		});
		test("PATCH - 200: should update the votes of a review by decreasing by passed value", () => {
			const update = { inc_votes: -3 };
			const output = {
				review_id: 2,
				title: "Jenga",
				designer: "Leslie Scott",
				owner: "philippaclaire9",
				review_img_url:
					"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
				review_body: "Fiddly fun for all the family",
				category: "dexterity",
				created_at: "2021-01-18T10:01:41.251Z",
				votes: 2,
			};
			return request(app)
				.patch("/api/reviews/2")
				.send(update)
				.expect(200)
				.then(({ body }) => {
					expect(body.review).toEqual(output);
				});
		});
		test("ERROR 400 - should return error message if given an invalid id", () => {
			const update = { inc_votes: 3 };
			return request(app)
				.patch("/api/reviews/not-a-review")
				.send(update)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, that's a bad request");
				});
		});
		test("ERROR 400 - should return error if given an empty body", () => {
			const update = {};
			return request(app)
				.patch("/api/reviews/1")
				.send(update)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toBe(
						"Sorry, you inputted something incorrectly"
					);
				});
		});
		test("ERROR 400 - should return error if body is an incorrect data type", () => {
			const update = { inc_votes: "hello world" };
			return request(app)
				.patch("/api/reviews/1")
				.send(update)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toBe(
						"Sorry, you inputted something incorrectly"
					);
				});
		});
		test("ERROR 404 - should return error if given valid id that doesn't exist", () => {
			const update = { inc_votes: 3 };
			return request(app)
				.patch("/api/reviews/9999")
				.send(update)
				.expect(404)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, 9999 is not a valid review_id");
				});
		});
	});
});
describe("/api/reviews/:review_id/comments", () => {
	describe("GET /api/reviews/:review_id/comments", () => {
		test("GET 200 - should return an object of the relevant review's comments", () => {
			return request(app)
				.get("/api/reviews/2/comments")
				.expect(200)
				.then((result) => {
					result.body.comments.forEach((comment) =>
						expect(comment).toMatchObject({
							comment_id: expect.any(Number),
							body: expect.any(String),
							votes: expect.any(Number),
							author: expect.any(String),
							review_id: expect.any(Number),
							created_at: expect.any(String),
						})
					);
				});
		});

		test("ERROR 400 - should return error message if given an invalid id", () => {
			return request(app)
				.get("/api/reviews/not-a-review/comments")
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, that's a bad request");
				});
		});

		test("ERROR 404 - should return error if given valid id that doesn't exist", () => {
			return request(app)
				.get("/api/reviews/9999/comments")
				.expect(404)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, 9999 is not a valid review_id");
				});
		});
	});

	describe("POST /api/reviews/:review_id/comments", () => {
		test("POST 201 - should respond with newly created comment", () => {
			const newComment = {
				author: "dav3rid",
				body: "awesome game!",
			};

			return request(app)
				.post("/api/reviews/1/comments")
				.send(newComment)
				.expect(201)
				.then((res) => {
					expect(res.body.comment).toEqual({
						comment_id: 7,
						review_id: 1,
						votes: 0,
						created_at: expect.any(String),
						...newComment,
					});
				});
		});
		test("ERROR 400 - should return error message if given an invalid id", () => {
			const newComment = {
				author: "dav3rid",
				body: "awesome game!",
			};
			return request(app)
				.post("/api/reviews/not-a-review/comments")
				.send(newComment)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, that's a bad request");
				});
		});
		test("ERROR 400 - should return error if given an empty body", () => {
			const newComment = {};
			return request(app)
				.post("/api/reviews/1/comments")
				.send(newComment)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toBe(
						"Sorry, you inputted something incorrectly"
					);
				});
		});
		test("ERROR 400 - should return error if body is an incorrect data type", () => {
			const newComment = {
				author: 4,
				body: 7,
			};
			return request(app)
				.post("/api/reviews/1/comments")
				.send(newComment)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toBe(
						"Sorry, you inputted something incorrectly"
					);
				});
		});
		test("ERROR 404 - should return error if given valid id that doesn't exist", () => {
			const newComment = {
				author: "dav3rid",
				body: "awesome game!",
			};
			return request(app)
				.post("/api/reviews/9999/comments")
				.send(newComment)
				.expect(404)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, 9999 is not a valid review_id");
				});
		});
		test("ERROR 404 - should return error if given invalid username", () => {
			const newComment = {
				author: "gabe",
				body: "awesome game!",
			};
			return request(app)
				.post("/api/reviews/1/comments")
				.send(newComment)
				.expect(404)
				.then((result) => {
					expect(result.body.msg).toBe("Sorry, gabe is not a valid username");
				});
		});
	});
});
describe("/api/users", () => {
	test("GET 200 - should return an object with all the users", () => {
		return request(app)
			.get("/api/users/")
			.expect(200)
			.then((result) => {
				result.body.users.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					});
				});
			});
	});
});
