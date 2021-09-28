import { Publisher, Subjects, TicketCreatedEvent } from '@eeki-ticketing/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
