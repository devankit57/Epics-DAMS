export interface User {
  _id?: string
  name: string
  email: string
  password: string
  createdAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

