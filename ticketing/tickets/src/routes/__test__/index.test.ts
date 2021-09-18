import request from 'supertest'
import { app } from '../../app'
import { ticketsBaseUrl } from '../../const'
import { createTicket } from '../../test/helpers'

it('can fetch a list of tickets', async () => {
  await createTicket('Valid title 1', 10)
  await createTicket('Valid title 2', 20)
  await createTicket('Valid title 3', 30)

  const response = await request(app).get(ticketsBaseUrl).send().expect(200)

  expect(response.body.length).toEqual(3)
})
