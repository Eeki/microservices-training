import { Subjects } from './subjects'
import { Event, Ticket } from './types'

export interface TicketCreatedEvent extends Event {
  subject: Subjects.TicketCreated
  data: Ticket
}
