import Link from 'next/link'
import type { CurrentUser, EnhancedNextPageContext, Ticket } from '../types'

interface LandingPageProps {
  currentUser: CurrentUser
  tickets: Ticket[]
}

const LandingPage = ({ tickets }: LandingPageProps): JSX.Element => {
  const ticketList = tickets.map(({ id, title, price }) => (
    <tr key={id}>
      <td>{title}</td>
      <td>{price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
          <a className="nav-link" style={{ padding: 0 }}>
            View
          </a>
        </Link>
      </td>
    </tr>
  ))

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async ({
  client,
}: EnhancedNextPageContext): Promise<{ tickets: Ticket[] }> => {
  const { data } = await client.get<Ticket[]>('/api/tickets')
  return { tickets: data }
}

export default LandingPage
