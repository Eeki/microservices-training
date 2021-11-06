import React from 'react'

interface ErrorListProps {
  errors: string[]
}

export function ErrorList({ errors }: ErrorListProps): JSX.Element {
  return errors.length ? (
    <div className="alert alert-danger">
      <h4>Ooops....</h4>
      <ul className="my-0">
        {errors.map((errorMessage) => (
          <li key={errorMessage}>{errorMessage}</li>
        ))}
      </ul>
    </div>
  ) : (
    <></>
  )
}
