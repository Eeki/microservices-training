import { Subjects } from './subjects'
import { Event } from './types'

export interface TicketUpdatedEvent extends Event {
  subject: Subjects.TicketUpdated
  data: {
    id: string
    version: number
    title: string
    price: number
    userId: string
  }
}
