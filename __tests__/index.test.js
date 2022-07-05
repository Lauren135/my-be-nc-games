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
  describe("PATCH /api/reviews/:review_id", () => {
    test("updates reviews vote by given number", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { reviews } }) => {
          reviews.forEach((review) => {
            expect(review).toEqual({
              review_id: 3,
              title: "Ultimate Werewolf",
              designer: "Akihisa Okui",
              owner: "bainesface",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "We couldn't find the werewolf!",
              category: "social deduction",
              created_at: expect.any(String),
              votes: 6,
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
    test("400: when passed anything but a number into inc_votes", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: "hello" })
        .expect(400)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Bad request");
        });
    });
  });
});
