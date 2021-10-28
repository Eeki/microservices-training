import { OrderCreatedEvent, OrderStatus } from '@eeki-ticketing/common'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { getFakeMessage, getMongoId } from '../../../test/helpers'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: getMongoId(),
    version: 0,
    expiresAt: new Date().toISOString(),
    userId: getMongoId(),
    status: OrderStatus.Created,
    ticket: {
      id: getMongoId(),
      price: 10,
    },
  }

  const msg = getFakeMessage()

  return { listener, data, msg }
}

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)
  expect(order?.price).toEqual(data.ticket.price)
  expect(order?.status).toEqual(data.status)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
