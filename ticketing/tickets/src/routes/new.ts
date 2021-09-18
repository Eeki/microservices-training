import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@eeki-ticketing/common'
import { Ticket } from '../models/ticket'
import { validateTicket } from '../middlewares/validate-ticket'
import { ticketsBaseUrl } from '../const'

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

    res.status(201).send(ticket)
  },
)

export { router as createTicketRouter }
