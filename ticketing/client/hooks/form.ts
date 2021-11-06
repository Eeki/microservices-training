import { useState, ChangeEvent } from 'react'

export type HTMLInputChangeEvent = ChangeEvent<HTMLInputElement>

export function useFormFields<T>(
  initialState: T,
): [
  T,
  (event: HTMLInputChangeEvent) => void,
  (field: keyof T, value: string) => void,
] {
  const [fields, setValues] = useState(initialState)

  return [
    fields,
    function (event: HTMLInputChangeEvent) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      })
    },
    function (field: keyof T, value: string) {
      setValues({
        ...fields,
        [field]: value,
      })
    },
  ]
}
