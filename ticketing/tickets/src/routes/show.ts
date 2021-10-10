import express, { Request, Response } from 'express'
import { param } from 'express-validator'
import { NotFoundError } from '@eeki-ticketing/common'
import { Ticket } from '../models/ticket'
import { ticketsBaseUrl } from '../const'

const router = express.Router()

router.get(
  `${ticketsBaseUrl}/:id`,
  param('orderId').isMongoId(),
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    res.send(ticket)
  },
)

export { router as showTicketRouter }
