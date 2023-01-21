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
        expect(message).toBe("not found");
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
          expect(response.body.reviews).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
    });
  });
});
describe("GET /api/reviews/:review_id", () => {
  test("/api/reviews/:review_id returns correct object", () => {
    return request(app)
      .get("/api/reviews/5")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: 5,
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String)

          })
        );
      });
  });
  test("generates error 400 if invalid review id", () => {
    return request(app)
      .get("/api/reviews/lol")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("invalid request");
      });
  });
  test("generates error 404 if non-existent review id", () => {
    return request(app)
      .get("/api/reviews/90000")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("no reviews found with that id");
      });
  });
  test("/api/reviews/:review_id/comments returns correct object", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toHaveLength(3);
        response.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              review_id: 3,
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("returns error if ID has not made any comments", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("no comments found with that id");
      });
  });
  test("generates error 400 if invalid review id", () => {
    return request(app)
      .get("/api/reviews/lol/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("invalid request");
      });
  });
});
describe("POST to /api/reviews/:review_id/comments ", () => {
  test("happy path to post comment", () => {
    return request(app)
      .post("/api/reviews/1/comments").send( {username: "mallionaire", body:"lorum ipsum stuff"})
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            review_id: 1,
            author: "mallionaire",
            body: "lorum ipsum stuff",
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("additional non-needed keys do not prevent from posting comment", () => {
    return request(app)
      .post("/api/reviews/1/comments").send( {username: "mallionaire", body:"lorum ipsum stuff", favouriteDog: "Cosmo"})
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            review_id: 1,
            author: "mallionaire",
            body: "lorum ipsum stuff",
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("returns 404 for non-existent Username", () => {
    return request(app)
      .post("/api/reviews/1/comments").send({
        username: "bali",
        body: "lorum ipsum stuff",
      })
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe(
          "not found"
        )
      );
  });
  
  test("returns 404 for non-existent ID", () => {
    return request(app)
      .post("/api/reviews/90000/comments").send({
        username: "mallionaire",
        body: "lorum ipsum stuff",
      })
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe(
          "not found"
        )
      );
  });
  test("returns 400 for invalid ID", () => {
    return request(app)
      .post("/api/reviews/lol/comments").send({
        username: "mallionaire",
        body: "lorum ipsum stuff",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("invalid request");
      });
  });
  test("returns 400 for invalid body", () => {
    return request(app)
      .post("/api/reviews/1/comments").send({ body: "lorum ipsum stuff" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("invalid request");
      });
  });
});
describe('PATCH /api/reviews/:review_id', () => {
  test('updates vote count by number given', () => {
      return request(app)
        .patch("/api/reviews/5").send({inc_votes: 1})
        .expect(200)
        .then((response) => {
          expect(response.body.review).toEqual(
            expect.objectContaining({
              review_id: 5,
              votes: 6
            })
          );
        });
  })
  test("additional non-needed keys do not prevent from posting comment", () => {
    return request(app)
      .patch("/api/reviews/5").send( {inc_votes: 100, pigeons: true})
      .expect(200)
      .then((response) => {
        expect(response.body.review).toEqual(
          expect.objectContaining({
            review_id: 5,
            votes: 105
          })
        );
      });
  });
  test("returns 404 for non-existent ID", () => {
    return request(app)
      .patch("/api/reviews/90000").send(
        {inc_votes: 1})
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe(
          "no reviews found with that id"
        )
      );
  });
  test("returns 400 for invalid ID", () => {
    return request(app)
      .patch("/api/reviews/lol").send(
        {inc_votes: 1}
      )
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("invalid request");
      });
  });
  test("returns 400 for invalid inc_votes value", () => {
    return request(app)
      .patch("/api/reviews/5").send({ inc_votes: "lorum ipsum stuff" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("invalid request");
      });
  });


})
describe('GET /api/users', () => {
  test('returns correct object', () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then((response) => {
      expect(response.body.users).toHaveLength(4)
      response.body.users.forEach( (user) => {expect(user).toEqual(expect.objectContaining({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String)
      }))
      })
    })
  }) 
})
describe('GET /api/reviews (query)', () => {
  test('filters/sorts/orders by query supplied ', () =>{
    return request(app)
    .get("/api/reviews?category=dexterity&sort_by=title&order=DESC")
    .expect(200)
    .then((response) => {
      response.body.reviews.forEach((review) => {expect(review).toEqual(expect.objectContaining({
        category: "dexterity"
      }))})
      expect(response.body.reviews).toBeSortedBy("title", {
        descending: true,
      });
    })
  })

  test('partial queries are accepted - categories', () => {
    return request(app)
    .get("/api/reviews?category=dexterity")
    .expect(200)
    .then((response) => {
      response.body.reviews.forEach((review) => {expect(review).toEqual(expect.objectContaining({
        category: "dexterity"
      }))})
    })
  })
  test('partial queries are accepted - sort_by', () => {
    return request(app)
    .get("/api/reviews?sort_by=title")
    .expect(200)
    .then((response) => {
      expect(response.body.reviews).toBeSortedBy("title", {
        ascending: true
      })})
  })
  test('ignores case differences for asc/desc', () => {
    return request(app)
    .get("/api/reviews?sort_by=title&order=desc")
    .expect(200)
    .then((response) => {
      expect(response.body.reviews).toBeSortedBy("title", {
        descending: true
      })})
  })
  test('ignores non-relevant queries', () => {
    return request(app)
    .get("/api/reviews?sort_by=title&order=desc&random=random")
    .expect(200)
    .then((response) => {
      expect(response.body.reviews).toBeSortedBy("title", {
        descending: true
      })})
  })
  // test('returns 400 for invalid category', () => {
  //   return request(app)
  //   .get("/api/reviews?category=invalid")
  //   .expect(400)
  //   .then(({ body: { message } }) => {
  //     expect(message).toBe("Invalid query");
  //   });
  // })
  test('returns 400 for invalid sort_by', () => {
    return request(app)
    .get("/api/reviews?category=dexterity&sort_by=invalid")
    .expect(400)
    .then(({ body: { message } }) => {
      expect(message).toBe("Invalid query");
    });
  })
  test('returns 400 for invalid order', () => {
    return request(app)
    .get("/api/reviews?category=dexterity&sort_by=title&order=random")
    .expect(400)
    .then(({ body: { message } }) => {
      expect(message).toBe("Invalid query");
    });
  })
})

describe("GET /api/users/:username", () => {
  test("/api/users/:username returns correct object", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then((response) => {
        expect(response.body.user).toEqual(
          expect.objectContaining({
            username: "mallionaire",
            name: 'haz',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
          
          })
        );
      });
  })
})