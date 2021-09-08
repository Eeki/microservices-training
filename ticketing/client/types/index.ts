// TODO get from common types
export interface User {
  id: string
  email: string
  iat: number
}

export interface CurrentUser {
  currentUser: User | null
}
