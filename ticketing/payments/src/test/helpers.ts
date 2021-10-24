import request, { Response } from 'supertest'
import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { app } from '../app'
import { ticketsBaseUrl } from '../const'

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

export const getFakeMessage = (): Message =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ({
    ack: jest.fn(),
  })
