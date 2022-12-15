const request = require("supertest");
const app = require("../games.app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { forEach } = require("../db/data/test-data/categories.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("endpoints", () => {
  test("paths that do not exist return 404 errors", () => {
    return request(app)
      .get("/doesnt_exist")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("path not found");
      });
  });
  describe("GET /api/categories", () => {
    test("returns status 200 and array containing objects w slug and description keys", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          expect(response.body.categories).toHaveLength(4);
          response.body.categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/reviews", () => {
    test("returns status 200 and array containing objects w required keys", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          expect(response.body.reviews).toHaveLength(13);
          response.body.reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
              })
            );
          });
        });
    });
    test("returns comment count for each review id", () => {
      return request(app)
        .get("/api/reviews")
        .then((response) => {
          response.body.reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("returns reviews in ordered by date with latest appearing first", () => {
      return request(app)
        .get("/api/reviews")
        .then((response) => {
          const reviewArray = response.body.reviews;
          for (let i = 0; i < (reviewArray.length -1); i++) {
            expect(Date.parse(reviewArray[i].created_at)).toBeGreaterThanOrEqual(
              Date.parse(reviewArray[i + 1].created_at)
            );
          }
        });
    });
  });
});
