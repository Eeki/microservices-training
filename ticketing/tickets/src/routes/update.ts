import express, { Request, Response } from 'express'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@eeki-ticketing/common'
import { Ticket } from '../models/ticket'
import { validateTicket } from '../middlewares/validate-ticket'
import { ticketsBaseUrl } from '../const'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put(
  `${ticketsBaseUrl}/:id`,
  requireAuth,
  validateTicket,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    const { title, price } = req.body

    ticket.set({ title, price })
    await ticket.save()

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.send(ticket)
  },
)

export { router as updateTicketRouter }
