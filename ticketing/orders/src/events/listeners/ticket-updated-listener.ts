import { Message } from 'node-nats-streaming'
import { Listener, Subjects, TicketUpdatedEvent } from '@eeki-ticketing/common'
import { ordersQueueGroupName } from './queue-group-name'
import { Ticket } from '../../models'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = ordersQueueGroupName
  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const { id, title, price } = data
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }
}
