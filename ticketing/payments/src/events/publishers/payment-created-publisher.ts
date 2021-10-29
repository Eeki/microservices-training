import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@eeki-ticketing/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
