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

describe("/api/categories", () => {
	test("GET 200 - should return with all the categories", () => {
		return request(app)
			.get("/api/categories/")
			.expect(200)
			.then((result) => {
				expect(
					result.body.categories.forEach((category) => {
						expect(category).toMatchObject({
							slug: expect.any(String),
							description: expect.any(String),
						});
					})
				);
			});
	});
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
