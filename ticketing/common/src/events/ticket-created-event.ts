import { Subjects } from './subjects'
import { Event } from './types'

export interface TicketCreatedEvent extends Event {
  subject: Subjects.TicketCreated
  data: {
    id: string
    version: number
    title: string
    price: number
    userId: string
  }
}
