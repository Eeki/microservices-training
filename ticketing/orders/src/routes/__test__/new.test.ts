import request from 'supertest'
import { Subjects, OrderStatus } from '@eeki-ticketing/common'
import { app } from '../../app'
import { getMongoId, buildTicket, buildOrder } from '../../test/helpers'
import { TICKETS_BASE_URL, ORDERS_BASE_URL } from '../../const'
import { Order } from '../../models'
import { natsWrapper } from '../../nats-wrapper'

it('returns an error if the ticket does not exists', async () => {
  const ticketId = getMongoId()
  await request(app)
    .post(TICKETS_BASE_URL)
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = await buildTicket()
  await buildOrder({ ticket })

  await request(app)
    .post(ORDERS_BASE_URL)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = await buildTicket()

  await request(app)
    .post(ORDERS_BASE_URL)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  const count = await Order.count({ ticket: ticket.id })
  expect(count).toEqual(1)
})

it('emits an order created event', async () => {
  const userId = getMongoId()
  const ticket = await buildTicket()

  const {
    body: { id, expiresAt },
  } = await request(app)
    .post(ORDERS_BASE_URL)
    .set('Cookie', global.signin(userId))
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subjects.OrderCreated,
    JSON.stringify({
      id,
      status: OrderStatus.Created,
      userId,
      expiresAt,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    }),
    expect.anything(),
  )
})
