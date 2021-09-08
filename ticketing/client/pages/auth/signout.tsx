import { useEffect } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

export default function Signout(): JSX.Element {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'POST',
    data: {},
    onSuccess: () => Router.push('/'),
  })

  useEffect(() => {
    doRequest()
  }, [])

  return <div>Signing you out...</div>
}
