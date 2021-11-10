import mongoose from 'mongoose'
import type { Message } from 'node-nats-streaming'
import { Order, OrderDoc, Ticket, TicketDoc } from '../models'
import { OrderStatus } from '@eeki-ticketing/common'

interface buildTicketAttrs {
  title?: string
  price?: number
  id?: string
}

interface buildOrderAttrs {
  ticket: TicketDoc
  userId?: string
  status?: OrderStatus
  expiresAt?: Date
}

export const getMongoId = (): string =>
  new mongoose.Types.ObjectId().toHexString()

export const buildTicket = async (
  attrs?: buildTicketAttrs,
): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: getMongoId(),
    ...attrs,
  })
  await ticket.save()
  return ticket
}

export const buildOrder = async (attrs: buildOrderAttrs): Promise<OrderDoc> => {
  const order = Order.build({
    userId: getMongoId(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ...attrs,
  })
  await order.save()
  return order
}

export const getFakeMessage = (): Message =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ({
    ack: jest.fn(),
  })
