import request from 'supertest'
import { app } from '../../app'
import { buildTicket, buildOrder, getMongoId } from '../../test/helpers'
import { ORDERS_BASE_URL } from '../../const'

it('fetches the order', async () => {
  // Create a ticket
  const ticket = await buildTicket()

  // create a order with this ticket
  const userId = getMongoId()
  const order = await buildOrder({ ticket, userId })

  // make request to fetch the order
  const { body } = await request(app)
    .get(`${ORDERS_BASE_URL}/${order.id}`)
    .set('Cookie', signin(userId))
    .send()
    .expect(200)
  expect(body.id).toEqual(order.id)
})

it('Return not found if the order does not exists', async () => {
  await request(app)
    .get(`${ORDERS_BASE_URL}/${getMongoId()}`)
    .set('Cookie', signin())
    .send()
    .expect(404)
})
it('Return not authorized if the the user does not own the order', async () => {
  const ticket = await buildTicket()
  const order = await buildOrder({ ticket })

  await request(app)
    .get(`${ORDERS_BASE_URL}/${order.id}`)
    .set('Cookie', signin())
    .send()
    .expect(401)
})
