import { NextPageContext } from 'next'
import { AxiosInstance } from 'axios'

export interface User {
  id: string
  email: string
  iat: number
}

export interface CurrentUser {
  currentUser: User | null
}

export interface Env {
  STRIPE_PUBLISHABLE_KEY: string
}

export interface EnhancedNextPageContext extends NextPageContext, CurrentUser {
  client: AxiosInstance
  env: Env
}

export interface PageProps {
  currentUser: User | null
}

export interface Ticket {
  id: string
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
}

export enum OrderStatus {
  Created = 'created',
  Cancelled = 'cancelled',
  AwaitingPayment = 'awaiting:payment',
  Complete = 'complete',
}

export interface Order {
  id: string
  userId: string
  version: number
  ticket: Pick<Ticket, 'id' | 'version' | 'title' | 'price'>
  status: OrderStatus
  expiresAt: string
}
