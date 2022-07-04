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
  });
  describe("GET /api/reviews/:review_id", () => {
    test("200: responds with information about given review_id", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body: { reviews } }) => {
          reviews.forEach((review) => {
            expect(review).toHaveProperty("review_id");
            expect(review).toHaveProperty("title");
            expect(review).toHaveProperty("review_body");
            expect(review).toHaveProperty("designer");
            expect(review).toHaveProperty("review_img_url");
            expect(review).toHaveProperty("votes");
            expect(review).toHaveProperty("category");
            expect(review).toHaveProperty("owner");
            expect(review).toHaveProperty("created_at");
          });
        });
    });
  });
  describe("Error handling", () => {
    test("404: when incorrect path is provided", () => {
      return request(app)
        .get("/api/*")
        .expect(404)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Invalid Path");
        });
    });
    test("404: when invalid Id provided", () => {
      return request(app)
        .get("/api/reviews/457")
        .expect(404)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Invalid Path");
        });
    });
  });
});
