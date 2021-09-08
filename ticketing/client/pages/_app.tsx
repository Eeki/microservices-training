import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'

import buildClient from '../api/build-client'
import Header from '../components/Header'
import type { CurrentUser } from '../types'

interface AppComponentProps extends AppProps, CurrentUser {}

const AppComponent = ({
  Component,
  pageProps,
  currentUser,
}: AppComponentProps): JSX.Element => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async ({ ctx, Component }: AppContext) => {
  try {
    const client = buildClient(ctx)
    const { data } = await client.get<CurrentUser>('/api/users/currentuser')

    const pageProps =
      typeof Component.getInitialProps === 'function'
        ? await Component.getInitialProps(ctx)
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
