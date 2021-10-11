import express, { Request, Response } from 'express'
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@eeki-ticketing/common'
import { param } from 'express-validator'
import { ORDERS_BASE_URL } from '../const'
import { Order, OrderStatus } from '../models'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
  `${ORDERS_BASE_URL}/:orderId`,
  requireAuth,
  param('orderId').isMongoId(),
  async (req: Request, res: Response) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Canceled
    await order.save()

    // TODO publishing an event saying this was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    })

    res.status(204).send(order)
  },
)

export { router as deleteOrderRouter }
