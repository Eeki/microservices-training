import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@eeki-ticketing/common'
import { Ticket, Order } from '../models'

const EXPIRATION_WINDOW_SECONDS = 5 * 60

const router = express.Router()

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      // This check assumes that the tickets service is using a mongodb.
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // Calculate an expiration date for this order
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    })
    await order.save()

    // TODO
    // Publish an event saying that an order was created

    res.status(201).send(order)
  },
)

export { router as newOrderRouter }