import { CustomError } from './custom-error'

// TODO status code 403 would suit better for this error
export class NotAuthorizedError extends CustomError {
  statusCode = 401

  constructor() {
    super('Not authorized')

    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: 'Not authorized' }]
  }
}
