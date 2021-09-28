import { Publisher, Subjects, TicketUpdatedEvent } from '@eeki-ticketing/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
