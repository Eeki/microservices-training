import { TicketCreatedEvent } from '@eeki-ticketing/common'
import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { getMongoId } from '../../../test/helpers'
import { Ticket } from '../../../models'
import { getFakeMessage } from '../../../../../tickets/src/test/helpers'

const setup = async (eventData?: Partial<TicketCreatedEvent['data']>) => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: getMongoId(),
    userId: getMongoId(),
    price: 10,
    title: 'concert',
    ...eventData,
  }

  const msg = getFakeMessage()

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertion to make sure a ticket was created
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket?.title).toEqual('concert')
  expect(ticket?.price).toEqual(10)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
