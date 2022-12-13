const db = require('./db/connection');

exports.selectGamesByCategory = (() => {
    return db.query("SELECT * FROM categories;").then( (results) => results.rows)
})