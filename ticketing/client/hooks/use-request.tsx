import { useState } from 'react'
import axios, { Method } from 'axios'

interface UseRequest {
  url: string
  method: Method
  data: Record<string, unknown>
  onSuccess?(data: any): void
}

interface ServerError {
  message: string
  field?: string
}

const useRequest = ({ url, method, data, onSuccess }: UseRequest) => {
  const [errors, setErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const doRequest = async () => {
    try {
      setErrors([])
      setFieldErrors({})
      const response = await axios.request({ method, url, data })

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

export default useRequest
