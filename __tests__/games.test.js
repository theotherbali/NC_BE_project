const request = require("supertest");
const app = require("../games.app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { forEach } = require("../db/data/test-data/categories.js");

beforeEach( () => {
    return seed(data)
})

afterAll( () => {
    return db.end()
})

describe ('endpoints', () =>{
    test('paths that do not exist return 404 errors', () => {
        return request(app)
            .get("/doesnt_exist")
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('path not found')
            })
    })
    describe('GET /api/categories', () => {
        test ('should return an array', () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then((response) => {
                expect(response.body.categories).toHaveLength(4)
                response.body.categories.forEach((category) => {
                    expect.objectContaining({slug: expect.any(String), description: expect.any(String)})
                } )
                
            }
                )
            })
    })
    describe('GET /api/reviews', () => {
        test('returns all reviews and status of 200', () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then( (response) => {
            expect(response.body.reviews).toHaveLength(12)
            response.body.reviews.forEach(
                (review) => {
                    expect.objectContaining({title: expect.any(String), owner: expect.any(String), review_img_url: expect.any(String), review_body: expect.any(String),
                    review_img_url: expect.any(String), created_at: expect.any(Date), votes: expect.any(Int)})
                }
            )
        })

        })
    })
    
    });

    //returns categories with slug and descriptions and status
