import Router from 'next/router'
import { useRequest } from '../../hooks/use-request'
import { ErrorList } from '../../components/ErrorList'
import { EnhancedNextPageContext, Order, Ticket } from '../../types'

interface TicketShowProps {
  ticket: Ticket
}

// TODO If not ticket show not found error

const TicketShow = ({
  ticket: { title, price, id },
}: TicketShowProps): JSX.Element => {
  const { doRequest, errors } = useRequest<Order>({
    method: 'POST',
    url: '/api/orders',
    data: { ticketId: id },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })

  return (
    <div>
      <h1>{title}</h1>
      <h4>Price: {price}</h4>
      <ErrorList errors={errors} />
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async ({
  query,
  client,
}: EnhancedNextPageContext) => {
  const { data } = await client.get(`/api/tickets/${query.ticketId}`)
  return { ticket: data }
}

export default TicketShow
