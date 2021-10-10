import request from 'supertest'
import { app } from '../../app'
import { getMongoId, buildTicket, buildOrder } from '../../test/helpers'
import { ORDERS_BASE_URL } from '../../const'

it('fetches orders for an particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOneId = getMongoId()
  const userTwoId = getMongoId()

  // Create one order as User #1
  await buildOrder({ ticket: ticketOne, userId: userOneId })

  //Create two orders as User #2
  const expectedOrderOne = await buildOrder({
    ticket: ticketTwo,
    userId: userTwoId,
  })
  const expectedOrderTwo = await buildOrder({
    ticket: ticketThree,
    userId: userTwoId,
  })

  // Make request to get orders for User #2
  const response = await request(app)
    .get(ORDERS_BASE_URL)
    .set('Cookie', signin(userTwoId))
    .expect(200)

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(expectedOrderOne.id)
  expect(response.body[1].id).toEqual(expectedOrderTwo.id)
})
