import { body } from 'express-validator'

export const validateTicket = [
  body('title').notEmpty().withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be provided and greater than 0'),
]
