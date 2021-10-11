import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@eeki-ticketing/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
