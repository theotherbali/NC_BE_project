const request = require("supertest");
const app = require("../games.app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

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
          expect(response.body.reviews).toBeSortedBy('created_at', {descending: true})
        });
    });
  });
});
describe.only("endpoints with parameters", () => {
  test("/api/reviews/:review_id returns correct object", () => {
    return request(app)
    .get("/api/reviews/5")
    .expect(200)
    .then((response) => {
      expect(response.body.reviews).toEqual(expect.objectContaining({
        owner: expect.any(String),
        title: expect.any(String),
        review_id: expect.any(Number),
        category: expect.any(String),
        review_img_url: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        designer: expect.any(String),
        comment_count: expect.any(String),
      }))
    })
  })
  test('generates error 400 if invalid snack id', () => {
    return request(app)
    .get("/api/reviews/lol")
    .expect(400)
    .then(({ body: { message } }) => {
      expect(message).toBe("invalid request");
    })
  })

})