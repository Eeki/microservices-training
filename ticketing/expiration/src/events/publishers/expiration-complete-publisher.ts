import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@eeki-ticketing/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
