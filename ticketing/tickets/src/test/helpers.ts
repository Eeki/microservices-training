import request, { Response } from 'supertest'
import { app } from '../app'
import { ticketsBaseUrl } from '../const'
import mongoose from 'mongoose'

export const createTicket = async (
  title: string,
  price: number,
  cookie = signin(),
): Promise<Response> =>
  await request(app)
    .post(ticketsBaseUrl)
    .set('Cookie', cookie)
    .send({ title, price })

export const getMongoId = (): string =>
  new mongoose.Types.ObjectId().toHexString()
