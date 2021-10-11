import { OrderCreatedEvent, Publisher, Subjects } from '@eeki-ticketing/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
