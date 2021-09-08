export interface User {
  id: string
  email: string
  iat: number
}

export interface CurrentUser {
  currentUser: User | null
}
