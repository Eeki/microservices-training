import { OrderCancelledEvent, OrderStatus } from '@eeki-ticketing/common'
import { Order } from '../../../models/order'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { getFakeMessage, getMongoId } from '../../../test/helpers'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: getMongoId(),
    status: OrderStatus.Created,
    price: 10,
    userId: getMongoId(),
    version: 0,
  })

  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: getMongoId(),
    },
  }

  const msg = getFakeMessage()

  return { listener, data, msg, order }
}

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
