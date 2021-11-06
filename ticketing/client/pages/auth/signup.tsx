import React from 'react'
import Router from 'next/router'
import { useRequest } from '../../hooks/use-request'
import Input from '../../components/Input'
import { useFormFields } from '../../hooks/form'
import { ErrorList } from '../../components/ErrorList'

const Signup = (): JSX.Element => {
  const [{ email, password }, handleFieldChange] = useFormFields({
    email: '',
    password: '',
  })
  const { doRequest, fieldErrors, errors } = useRequest({
    method: 'POST',
    url: '/api/users/signup',
    data: { email, password },
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <Input
        value={email}
        label="Email address"
        type="email"
        id="email"
        onChange={handleFieldChange}
        ariaDescribedby="email"
        error={fieldErrors.email}
      />
      <Input
        value={password}
        label="Password"
        type="password"
        id="password"
        onChange={handleFieldChange}
        ariaDescribedby="password"
        error={fieldErrors.password}
      />
      <ErrorList errors={errors} />
      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
    </form>
  )
}
export default Signup
