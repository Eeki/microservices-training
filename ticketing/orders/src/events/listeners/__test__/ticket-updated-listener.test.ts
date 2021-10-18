import { TicketUpdatedEvent } from '@eeki-ticketing/common'
import { Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'
import { getMongoId } from '../../../test/helpers'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { getFakeMessage } from '../../../../../tickets/src/test/helpers'

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // Create and save a ticket
  const ticket = Ticket.build({
    id: getMongoId(),
    price: 10,
    title: 'concert',
  })
  await ticket.save()

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    userId: getMongoId(),
    price: 50,
    title: 'concert 2',
  }

  const msg = getFakeMessage()

  return { listener, data, msg, ticket }
}

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket?.title).toEqual(data.title)
  expect(updatedTicket?.price).toEqual(data.price)
  expect(updatedTicket?.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup()

  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
