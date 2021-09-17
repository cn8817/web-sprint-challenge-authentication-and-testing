// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')

it('[0] sanity check', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  describe('[POST] /api/auth/register', () => {
    it('[1] creates a new user in the db', async () => {
      await request(server).post('/api/auth/register').send({ username: 'christine', password:'1234'})
      const christine = await db('users').where('username', 'christine').first()
      expect(christine).toMatchObject({ username: 'christine'})
    }, 750)
    it('[2] new user passwords are saved in bcrypt', async () => {
      await request(server).post('/api/auth/register').send({username: 'christine', password: '1234'})
      const christine = await db('users').where('username', 'christine').first()
      expect(bcrypt.compareSync('1234', christine.password)).toBeTruthy()
    }, 750)
})

  describe('[POST] /api/auth/login', () => {
    it('[1] responds with the correct message on valid credentials', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      expect(res.body.message).toMatch(/bob is back/i)
    }, 750)
    it('[2] responds with the correct status and message on invalid credentials', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
      expect(res.body.message).toMatch(/invalid credentials/i)
      expect(res.status).toBe(401)
      res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '12345' })
      expect(res.body.message).toMatch(/invalid credentials/i)
      expect(res.status).toBe(401)
    }, 750)
  })
})