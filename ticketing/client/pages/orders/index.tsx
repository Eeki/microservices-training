import { EnhancedNextPageContext, Order } from '../../types'

interface OrderIndexProps {
  orders: Order[]
}

const OrderIndex = ({ orders }: OrderIndexProps): JSX.Element => {
  return (
    <>
      <h1>My Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.ticket.title} - {order.ticket.price} - {order.status}
          </li>
        ))}
      </ul>
    </>
  )
}

OrderIndex.getInitialProps = async ({ client }: EnhancedNextPageContext) => {
  const { data } = await client.get<Order[]>('/api/orders')
  return { orders: data }
}

export default OrderIndex
