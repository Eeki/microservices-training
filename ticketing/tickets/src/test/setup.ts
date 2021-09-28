import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { getMongoId } from './helpers'

jest.mock('../nats-wrapper')

declare global {
  // eslint-disable-next-line no-var
  var signin: () => string[]
}

let mongo: MongoMemoryServer

beforeAll(async () => {
  process.env.JWT_KEY = 'super-secret-key'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = (id = getMongoId()) => {
  const payload = {
    id,
    email: 'fake@test.com',
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const sessionJSON = JSON.stringify(session)
  const sessionBase64 = Buffer.from(sessionJSON).toString('base64')
  return [`express:sess=${sessionBase64}`]
}
