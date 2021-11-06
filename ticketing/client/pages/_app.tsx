import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'

import buildClient from '../api/build-client'
import Header from '../components/Header'
import type { CurrentUser, EnhancedNextPageContext } from '../types'

interface AppComponentProps extends AppProps, CurrentUser {}

const AppComponent = ({
  Component,
  pageProps,
  currentUser,
}: AppComponentProps): JSX.Element => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  )
}

AppComponent.getInitialProps = async ({ ctx, Component }: AppContext) => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('STRIPE_PUBLISHABLE_KEY not set')
  }

  try {
    const client = buildClient(ctx)
    const { data } = await client.get<CurrentUser>('/api/users/currentuser')

    // TODO type the Components to get EnhancedNextPageContext as default
    const nextPageContext: EnhancedNextPageContext = {
      client,
      currentUser: data.currentUser,
      env: {
        STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      },
      ...ctx,
    }

    const pageProps =
      typeof Component.getInitialProps === 'function'
        ? await Component.getInitialProps(nextPageContext)
        : {}
    return {
      pageProps,
      ...data,
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error:', err.message)
    }
    return { currentUser: null }
  }
}
export default AppComponent
