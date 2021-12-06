import { useEffect, useState } from 'react'
import Router from 'next/router'
// TODO react-stripe-checkout is pretty old library and using legacy version of Stripe Checkout.
import StripeCheckout from 'react-stripe-checkout'
import { useRequest } from '../../hooks/use-request'

import { EnhancedNextPageContext, Env, Order, PageProps } from '../../types'
import { ErrorList } from '../../components/ErrorList'

interface OrderShowProps extends PageProps {
  order: Order
  env: Env
}

const OrderShow = ({
  order,
  env,
  currentUser,
}: OrderShowProps): JSX.Element => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { errors, doRequest } = useRequest({
    method: 'POST',
    url: '/api/payments',
    data: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).valueOf() - new Date().valueOf()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  return (
    <div>
      {timeLeft} second until order expires
      <div>
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey={env.STRIPE_PUBLISHABLE_KEY}
          amount={order.ticket.price * 100} // Because stripe is using cents
          email={currentUser?.email}
          currency="EUR"
        />
        <ErrorList errors={errors} />
      </div>
    </div>
  )
}

OrderShow.getInitialProps = async ({
  query: { orderId },
  client,
  env,
}: EnhancedNextPageContext) => {
  const { data } = await client.get<Order>(`/api/orders/${orderId}`)
  return { order: data, env }
}

export default OrderShow
