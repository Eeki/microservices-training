import request from 'supertest'
import { OrderStatus } from '@eeki-ticketing/common'
import { app } from '../../app'
import { paymentsBaseUrl } from '../../const'
import { createOrder, getMongoId } from '../../test/helpers'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

jest.mock('../../stripe')

it('returns a 404 when purchasing an order that does not exists', async () => {
  await request(app)
    .post(paymentsBaseUrl)
    .set('Cookie', signin())
    .send({
      token: 'tok_visa',
      orderId: getMongoId(),
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = await createOrder()

  await request(app)
    .post(paymentsBaseUrl)
    .set('Cookie', signin())
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = getMongoId()
  const order = await createOrder({ userId, status: OrderStatus.Cancelled })

  await request(app)
    .post(paymentsBaseUrl)
    .set('Cookie', signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = getMongoId()
  const order = await createOrder({ userId })

  await request(app)
    .post(paymentsBaseUrl)
    .set('Cookie', signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(order.price * 100)
  expect(chargeOptions.currency).toEqual('eur')
})

it('create a payment with valid inputs', async () => {
  const userId = getMongoId()
  const order = await createOrder({ userId })

  await request(app)
    .post(paymentsBaseUrl)
    .set('Cookie', signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: 'stripe-mock-id', // The mock stripe will always return this value
  })

  expect(payment).not.toBeNull()
})
