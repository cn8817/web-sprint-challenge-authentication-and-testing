const db = require('../../data/dbConfig')

function find() {
    return db('users')
}

function findById() {
    return db('users')
    .where('users.user_id', user_id).first()
}

module.exports = {
    find,
    findById,
}