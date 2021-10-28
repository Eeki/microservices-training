import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@eeki-ticketing/common'
import { paymentQueueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = paymentQueueGroupName

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    })

    await order.save()

    msg.ack()
  }
}
