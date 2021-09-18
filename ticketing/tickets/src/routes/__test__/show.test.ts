import request from 'supertest'
import { app } from '../../app'
import { ticketsBaseUrl } from '../../const'
import { createTicket, getMongoId } from '../../test/helpers'

it('returns a 404 if ticket is not found', async () => {
  const id = getMongoId()
  await request(app).get(`${ticketsBaseUrl}/${id}`).send().expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const title = 'Valid title'
  const price = 20

  const response = await createTicket(title, price)

  const ticketResponse = await request(app)
    .get(`${ticketsBaseUrl}/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})
