import { Message } from 'node-nats-streaming'
import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from '@eeki-ticketing/common'
import { Order } from '../../models/order'
import { paymentQueueGroupName } from './queue-group-name'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = paymentQueueGroupName

  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findByEvent(data)

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    msg.ack()
  }
}
