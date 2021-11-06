import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'
import { ticketsBaseUrl } from '../const'

const router = express.Router()

router.get(ticketsBaseUrl, async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  })

  res.send(tickets)
})

export { router as indexTicketRouter }
