import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@eeki-ticketing/common'
import { Order } from '../models/order'
import { stripe } from '../stripe'
import { paymentsBaseUrl } from '../const'

const router = express.Router()

router.post(
  paymentsBaseUrl,
  requireAuth,
  [body('token').notEmpty(), body('orderId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status == OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for cancelled order')
    }

    await stripe.charges.create({
      currency: 'eur',
      amount: order.price * 100, // stripe unit is cent
      source: token,
    })

    res.status(201).send({ success: true })
  },
)

export { router as createChargeRouter }
