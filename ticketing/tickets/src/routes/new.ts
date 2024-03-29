import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@eeki-ticketing/common'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { validateTicket } from '../middlewares/validate-ticket'
import { ticketsBaseUrl } from '../const'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  ticketsBaseUrl,
  requireAuth,
  validateTicket,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    })
    await ticket.save()
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.status(201).send(ticket)
  },
)

export { router as createTicketRouter }
