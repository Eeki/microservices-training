import { useState } from 'react'
import axios, { Method } from 'axios'

interface UseRequest<T> {
  url: string
  method: Method
  data: Record<string, unknown>
  onSuccess?(data: T): void
}

interface ServerError {
  message: string
  field?: string
}

interface UserRequestResult<T> {
  doRequest: (props?: Record<string, unknown>) => Promise<T | undefined>
  fieldErrors: Record<string, string>
  errors: string[]
}

export function useRequest<T>({
  url,
  method,
  data,
  onSuccess,
}: UseRequest<T>): UserRequestResult<T> {
  const [errors, setErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const doRequest = async (props = {}) => {
    try {
      setErrors([])
      setFieldErrors({})
      const response = await axios.request<T>({
        method,
        url,
        data: { ...data, ...props },
      })

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      const newErrors: string[] = []
      const newFieldErrors: Record<string, string> = {}

      if (axios.isAxiosError(err)) {
        const serverErrors = err?.response?.data.errors as ServerError[]
        for (const { field, message } of serverErrors) {
          if (field) {
            newFieldErrors[field] = message
          } else {
            newErrors.push(message)
          }
        }
      }
      setFieldErrors(newFieldErrors)
      setErrors(newErrors)
    }
  }

  return { doRequest, fieldErrors, errors }
}
