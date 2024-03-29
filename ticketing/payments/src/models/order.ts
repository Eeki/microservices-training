import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@eeki-ticketing/common'

export interface OrderAttrs {
  id: string
  version: number
  userId: string
  price: number
  status: OrderStatus
}

export interface OrderDoc extends Omit<mongoose.Document, '_id'> {
  version: number
  userId: string
  price: number
  status: OrderStatus
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({ _id: event.id, version: event.version - 1 })
}

orderSchema.statics.build = ({
  id,
  version,
  price,
  userId,
  status,
}: OrderAttrs) => {
  return new Order({
    _id: id,
    version,
    price,
    userId,
    status,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)
export { Order }
