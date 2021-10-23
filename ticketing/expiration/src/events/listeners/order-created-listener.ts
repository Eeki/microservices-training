import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@eeki-ticketing/common'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      },
    )
    msg.ack()
  }
}
