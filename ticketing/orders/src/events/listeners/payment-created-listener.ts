import { Message } from 'node-nats-streaming'
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@eeki-ticketing/common'
import { ordersQueueGroupName } from './queue-group-name'
import { Order } from '../../models'

export class paymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
  queueGroupName = ordersQueueGroupName

  async onMessage(
    data: PaymentCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({
      status: OrderStatus.Complete,
    })
    await order.save()

    // Order updated event is not emitted here.
    // That is because when payment is set as Complete
    // it shouldn't change anymore.
    // This can be changed later if needed

    msg.ack()
  }
}
