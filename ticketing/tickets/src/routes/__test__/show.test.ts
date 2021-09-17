import request from 'supertest'
import { app } from '../../app'

it('returns a 404 if ticket is not found', async () => {
  await request(app).get('/api/tickets/123456789').send().expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const title = 'Valid title'
  const price = 20

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title, price })

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})
