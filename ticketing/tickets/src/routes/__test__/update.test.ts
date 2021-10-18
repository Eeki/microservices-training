import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { ticketsBaseUrl } from '../../const'
import { createTicket, getMongoId } from '../../test/helpers'
import { natsWrapper } from '../../nats-wrapper'

it('returns a 404 if the provided id does not exits', async () => {
  const id = getMongoId()
  await request(app)
    .put(`${ticketsBaseUrl}/${id}`)
    .set('Cookie', signin())
    .send({ title: 'foo', price: 1 })
    .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = getMongoId()
  await request(app)
    .put(`${ticketsBaseUrl}/${id}`)
    .send({ title: 'foo', price: 1 })
    .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const title = 'title 1'
  const price = 5
  const response = await createTicket(title, price)

  await request(app)
    .put(`${ticketsBaseUrl}/${response.body.id}`)
    .set('Cookie', signin())
    .send({ title: 'new title', price: 10 })
    .expect(401)

  // Test that ticket was not updated
  const ticket = await Ticket.findById(response.body.id)
  expect(ticket?.title).toEqual(title)
  expect(ticket?.price).toEqual(price)
})

it('returns 400 if the user provides an invalid title or price', async () => {
  const cookie = signin()
  const response = await createTicket('title', 10, cookie)

  await request(app)
    .put(`${ticketsBaseUrl}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400)

  await request(app)
    .put(`${ticketsBaseUrl}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'valid title', price: -10 })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = signin()
  const response = await createTicket('title', 10, cookie)

  const newTitle = 'New title'
  const newPrice = 100

  const updateResponse = await request(app)
    .put(`${ticketsBaseUrl}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200)

  expect(updateResponse.body.title).toEqual(newTitle)
  expect(updateResponse.body.price).toEqual(newPrice)

  const ticket = await Ticket.findById(response.body.id)
  expect(ticket?.title).toEqual(newTitle)
  expect(ticket?.price).toEqual(newPrice)
})

it('publishes an event', async () => {
  const cookie = signin()
  const response = await createTicket('title', 10, cookie)

  const newTitle = 'New title'
  const newPrice = 100

  await request(app)
    .put(`${ticketsBaseUrl}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => {
  const cookie = signin()
  const response = await createTicket('title', 10, cookie)

  const ticket = await Ticket.findById(response.body.id)
  ticket!.set({ orderId: getMongoId() })
  await ticket!.save()

  await request(app)
    .put(`${ticketsBaseUrl}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 200 })
    .expect(400)
})
