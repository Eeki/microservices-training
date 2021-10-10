import express, { Request, Response } from 'express'
import { param } from 'express-validator'
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@eeki-ticketing/common'
import { Order } from '../models'
import { ORDERS_BASE_URL } from '../const'

const router = express.Router()

router.get(
  `${ORDERS_BASE_URL}/:orderId`,
  requireAuth,
  param('orderId').isMongoId(),
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    res.send(order)
  },
)

export { router as showOrderRouter }
