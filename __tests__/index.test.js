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
  describe("PATCH /api/reviews/:review_id", () => {
    test("200: updates reviews vote by given number", () => {
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
  describe("GET /api/reviews/:review_id/comment_count", () => {
    test("200: reviews has comment-count", () => {
      return request(app)
        .get("/api/reviews/2/comment_count")
        .expect(200)
        .then(({ body: { reviews } }) => {
          reviews.forEach((review) => {
            expect(review).toEqual({
              review_id: 2,
              title: "Jenga",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Fiddly fun for all the family",
              category: "dexterity",
              created_at: expect.any(String),
              votes: 5,
              comment_count: expect.any(String),
            });
          });
        });
    });
    test("404: when Id provided is not found", () => {
      return request(app)
        .get("/api/reviews/457/comment_count")
        .expect(404)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Review ID not found");
        });
    });
    test("400: when invalid Id provided", () => {
      return request(app)
        .get("/api/reviews/wrong/comment_count")
        .expect(400)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Bad request");
        });
    });
  });
  describe("GET /api/reviews", () => {
    test("200: responds with all reviews with comment-count sorted by created-at", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
            coerce: true,
          });
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
            expect(review).toHaveProperty("comment_count");
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
              comment_count: expect.any(String),
            });
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
  describe("GET /api/reviews/:review_id/comments", () => {
    test("200: responds with comments for given review-id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("review_id");
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect.objectContaining({
              review_id: 2,
            });
          });
        });
    });
    test("404: when no comments exist for given ID", () => {
      return request(app)
        .get("/api/reviews/7/comments")
        .expect(404)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("No comments for given ID");
        });
    });
    test("400: when invalid Id provided", () => {
      return request(app)
        .get("/api/reviews/wrong/comments")
        .expect(400)
        .then(({ body }) => {
          const errorMessage = body.msg;
          expect(errorMessage).toBe("Bad request");
        });
    });
  });
});
