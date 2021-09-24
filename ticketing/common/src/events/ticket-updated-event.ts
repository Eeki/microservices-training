import { Subjects } from './subjects'
import { Event, Ticket } from './types'

export interface TicketUpdatedEvent extends Event {
  subject: Subjects.TicketUpdated
  data: Ticket
}
