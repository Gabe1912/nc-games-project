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
	/* test("output should be in decending order of date", () => {
		return request(app)
			.get("/api/reviews/")
			.expect(200)
			.then((res) => {
				expect(res.body.reviews).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	}); */
});
