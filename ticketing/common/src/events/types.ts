import { Subjects } from './subjects'

export interface Event {
  subject: Subjects
  data: any
}

export interface Ticket {
  id: string
  title: string
  price: number
  userId: string
}
