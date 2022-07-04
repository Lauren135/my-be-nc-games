const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => {
  return connection.end();
});

describe("my Express app", () => {
  describe("GET /api/categories", () => {
    test("200: responds with categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
    test("404: when incorrect path is provided", () => {
      return request(app)
        .get("/api/*")
        .expect(404)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Invalid Path");
        });
    });
  });
});
