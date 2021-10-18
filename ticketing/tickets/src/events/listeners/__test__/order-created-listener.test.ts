import { OrderCreatedEvent, OrderStatus } from '@eeki-ticketing/common'
import { OrderCreatedListeners } from '../order-created-listeners'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { getFakeMessage, getMongoId } from '../../../test/helpers'
import { Subjects } from '../../../../../common/src'

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListeners(natsWrapper.client)

  // Create and save a ticket
  const ticket = await Ticket.build({
    title: 'concert',
    price: 20,
    userId: getMongoId(),
  })
  await ticket.save()

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: getMongoId(),
    version: 0,
    userId: getMongoId(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const msg = getFakeMessage()

  return { listener, ticket, data, msg }
}

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket?.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mockFn = natsWrapper.client.publish as jest.mock

  expect(mockFn.mock.calls[0][0]).toEqual(Subjects.TicketUpdated)

  const ticketUpdatedData = JSON.parse(mockFn.mock.calls[0][1])
  expect(data.id).toEqual(ticketUpdatedData.orderId)
})
