import type { NextPageContext } from 'next'
import buildClient from '../api/build-client'
import type { CurrentUser } from '../types'

const LandingPage = ({ currentUser }: CurrentUser): JSX.Element => {
  return <h1>{currentUser ? 'You are signed in' : 'You are NOT sign in'}</h1>
}

LandingPage.getInitialProps = async (context: NextPageContext): Promise<CurrentUser> => {
  try {
    const client = buildClient(context)
    const { data } = await client.get<CurrentUser>('/api/users/currentuser')
    return data
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error:', err.message)
    }
    return { currentUser: null }
  }
}

export default LandingPage
