import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'

export const getMongoId = (): string =>
  new mongoose.Types.ObjectId().toHexString()

export const getFakeMessage = (): Message =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ({
    ack: jest.fn(),
  })
