import { OrderCancelledListener } from '../order-cancelled-listener'
import { OrderCancelledEvent } from '@eeki-ticketing/common'
import { Subjects } from '@eeki-ticketing/common'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { getFakeMessage, getMongoId } from '../../../test/helpers'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = getMongoId()
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: getMongoId(),
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  const msg = getFakeMessage()

  return { msg, data, ticket, orderId, listener }
}

it('updates the ticket', async () => {
  const { msg, data, ticket, listener } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket?.orderId).not.toBeDefined()
})

it('publishes an ticket updated event', async () => {
  const { msg, data, listener, ticket } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subjects.TicketUpdated,
    JSON.stringify({
      id: ticket.id,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version + 1,
    }),
    expect.anything(),
  )
})

it('acks the message', async () => {
  const { msg, data, listener } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
