const request = require("supertest");
const app = require("../games.app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach( () => {
    return seed(data)
})

afterAll( () => {
    return db.end()
})

describe ('endpoints', () =>{
    test('paths that do not exist return 404 errors', () => {
        return request(app)
            .get("/api/doesnt_exist")
            .expect(404)
    })
    describe('GET /api/categories', () => {
        test ('should return an array', () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    [
                        { slug: 'euro game', description: 'Abstact games that involve little luck' },
                        {
                          slug: 'social deduction',
                          description: "Players attempt to uncover each other's hidden role"
                        },
                        { slug: 'dexterity', description: 'Games involving physical skill' },
                        { slug: "children's games", description: 'Games suitable for children' }
                      ]
                )
            })
    })
    
    })
});
