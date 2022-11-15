const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => {
	return db.end();
});

beforeEach(() => {
	return seed(data);
});

describe("/api/", () => {
	test("GET 404 - route not found", () => {
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
	test("GET 200 - should return with all the reviews", () => {
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
	test("GET 200 - should return an object of the relevant ", () => {
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
			votes: 1,
		};
		return request(app)
			.get("/api/reviews/1")
			.expect(200)
			.then((result) => {
				expect(result.body).toEqual({ review: output });
			});
	});
	test("GET 404 - should return error if given valid id that doesn't exist", () => {
		return request(app)
			.get("/api/reviews/9999")
			.expect(404)
			.then((result) => {
				expect(result.body.msg).toBe("Sorry, that review does not exist");
			});
	});
	test("GET 400 - should return error message if given an invalid id", () => {
		return request(app)
			.get("/api/reviews/not-a-review")
			.expect(400)
			.then((result) => {
				expect(result.body.msg).toBe("Sorry, that isn't a valid id");
			});
	});
});
