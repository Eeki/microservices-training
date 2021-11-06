import React from 'react'
import Router from 'next/router'
import { useRequest } from '../../hooks/use-request'
import Input from '../../components/Input'
import { useFormFields } from '../../hooks/form'

const Signup = (): JSX.Element => {
  const [{ email, password }, handleFieldChange] = useFormFields({
    email: '',
    password: '',
  })

  const { doRequest, fieldErrors, errors } = useRequest({
    method: 'POST',
    url: '/api/users/signin',
    data: { email, password },
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
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
      {Boolean(errors.length) && (
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {errors.map((errorMessage) => (
              <li key={errorMessage}>{errorMessage}</li>
            ))}
          </ul>
        </div>
      )}
      <button type="submit" className="btn btn-primary">
        Sign In
      </button>
    </form>
  )
}
export default Signup
