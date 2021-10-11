import request from 'supertest'
import { Subjects } from '@eeki-ticketing/common'
import { app } from '../../app'
import { buildTicket, buildOrder, getMongoId } from '../../test/helpers'
import { ORDERS_BASE_URL } from '../../const'
import { Order, OrderStatus } from '../../models'
import { natsWrapper } from '../../nats-wrapper'

it('marks an order as cancelled', async () => {
  // Create a ticket
  const ticket = await buildTicket()

  // create a order with this ticket
  const userId = getMongoId()
  const order = await buildOrder({ ticket, userId })

  // make request to cancel the order
  await request(app)
    .delete(`${ORDERS_BASE_URL}/${order.id}`)
    .set('Cookie', signin(userId))
    .send()
    .expect(204)

  // expectation to make sure the order is cancelled
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder?.status).toEqual(OrderStatus.Canceled)
})

it('Return not found if the order does not exists', async () => {
  await request(app)
    .delete(`${ORDERS_BASE_URL}/${getMongoId()}`)
    .set('Cookie', signin())
    .send()
    .expect(404)
})
it('Return not authorized if the the user does not own the order', async () => {
  const ticket = await buildTicket()
  const order = await buildOrder({ ticket })

  await request(app)
    .delete(`${ORDERS_BASE_URL}/${order.id}`)
    .set('Cookie', signin())
    .send()
    .expect(401)
})

it('emits a order cancelled event', async () => {
  const userId = getMongoId()
  const ticket = await buildTicket()
  const order = await buildOrder({ ticket, userId })

  await request(app)
    .delete(`${ORDERS_BASE_URL}/${order.id}`)
    .set('Cookie', signin(userId))
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subjects.OrderCancelled,
    JSON.stringify({ id: order.id, ticket: { id: ticket.id } }),
    expect.anything(),
  )
})
