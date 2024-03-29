import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order, OrderStatus } from './orders'

interface TicketAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  version: number
  title: string
  price: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 })
}
ticketSchema.statics.build = ({ id, ...rest }: TicketAttrs) => {
  return new Ticket({
    _id: id,
    ...rest,
  })
}

// The key word function is used here to have the right context for "this"
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })
  return Boolean(existingOrder)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
