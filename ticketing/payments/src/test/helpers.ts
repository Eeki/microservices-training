import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { Order, OrderDoc } from '../models/order'
import { OrderStatus } from '@eeki-ticketing/common'

interface OrderAttrs {
  id?: string
  version?: number
  userId?: string
  price?: number
  status?: OrderStatus
}

export const createOrder = async (attrs?: OrderAttrs): Promise<OrderDoc> => {
  const order = Order.build({
    id: getMongoId(),
    userId: getMongoId(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
    ...attrs,
  })
  await order.save()
  return order
}

export const getMongoId = (): string =>
  new mongoose.Types.ObjectId().toHexString()

export const getFakeMessage = (): Message =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ({
    ack: jest.fn(),
  })
