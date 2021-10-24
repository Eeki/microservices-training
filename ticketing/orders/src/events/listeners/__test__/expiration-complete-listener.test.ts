import { ExpirationCompleteEvent } from '@eeki-ticketing/common'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket, Order, OrderStatus } from '../../../models'
import { getMongoId } from '../../../test/helpers'
import { getFakeMessage } from '../../../../../tickets/src/test/helpers'
import { Subjects } from '../../../../../common/src'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: getMongoId(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: getMongoId(),
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  const msg = getFakeMessage()

  return { listener, order, ticket, data, msg }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder?.status).toEqual(OrderStatus.Canceled)
})

it('emits an OrderCancelled event', async () => {
  const { listener, order, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const mockPublishFn = natsWrapper.client.publish as jest.Mock
  const publishedEventSubject = mockPublishFn.mock.calls[0][0]
  const publishedEventData = JSON.parse(mockPublishFn.mock.calls[0][1])

  expect(mockPublishFn.mock.calls.length).toEqual(1)
  expect(publishedEventSubject).toEqual(Subjects.OrderCancelled)
  expect(publishedEventData).toEqual({
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: ticket.id,
    },
  })
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})