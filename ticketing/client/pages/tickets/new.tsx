import React, { FormEvent } from 'react'
import Router from 'next/router'
import { useFormFields } from '../../hooks/form'
import { useRequest } from '../../hooks/use-request'
import Input from '../../components/Input'
import { ErrorList } from '../../components/ErrorList'

const NewTicket = (): JSX.Element => {
  const [{ title, price }, handleFieldChange, setField] = useFormFields({
    title: '',
    price: '',
  })

  const { doRequest, fieldErrors, errors } = useRequest({
    method: 'POST',
    url: '/api/tickets',
    data: { title, price },
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await doRequest()
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return
    }

    setField('price', value.toFixed(2))
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <Input
          value={title}
          label="Title"
          type="text"
          id="title"
          onChange={handleFieldChange}
          ariaDescribedby="title"
          error={fieldErrors.title}
        />

        <Input
          value={price}
          label="Price"
          type="number"
          id="price"
          onChange={handleFieldChange}
          onBlur={onBlur}
          ariaDescribedby="price"
          error={fieldErrors.price}
        />
        <ErrorList errors={errors} />
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket
