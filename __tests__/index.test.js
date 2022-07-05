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
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(Number),
            });
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
    test("404: when Id provided is not found", () => {
      return request(app)
        .get("/api/reviews/457")
        .expect(404)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Review ID not found");
        });
    });
    test("400: when invalid Id provided", () => {
      return request(app)
        .get("/api/reviews/wrong")
        .expect(400)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Bad request");
        });
    });
  });
  describe("GET /api/users", () => {
    test("200: responds with users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
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
