import express, { Request, Response } from 'express'
import { NotFoundError } from '@eeki-ticketing/common'
import { Ticket } from '../models/ticket'
import { ticketsBaseUrl } from '../const'

const router = express.Router()

router.get(`${ticketsBaseUrl}/:id`, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    throw new NotFoundError()
  }

  res.send(ticket)
})

export { router as showTicketRouter }
