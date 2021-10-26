import { Message } from 'node-nats-streaming'
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@eeki-ticketing/common'
import { ordersQueueGroupName } from './queue-group-name'
import { Order } from '../../models'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  queueGroupName = ordersQueueGroupName

  async onMessage(
    data: ExpirationCompleteEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new Error('Order not found')
    }
    order.set({ status: OrderStatus.Cancelled })
    await order.save()
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })
    msg.ack()
  }
}
