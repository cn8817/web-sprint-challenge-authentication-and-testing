const db = require('../../data/dbConfig')

function findBy(filter) {
  return db('users')
  .select('id', 'username','password')
  .where(filter)
}

function findById(id) {
    return db('users')
  .select('id', 'username', 'password')
  .where('users.id', id).first()
}

async function add({ username, password }) { 
    let created_id
    await db.transaction(async trx => {
      const [id] = await trx('users').insert({ username, password})
      created_id = id
    })
    return findById(created_id)
  }

  module.exports = {
    add,
    findBy,
    findById,
  };