export type UserRole = 'user' | 'moderator' | 'admin'

export interface User {
    id: string
    username: string
    email: string
    role: UserRole
    createdAt: Date
}

export interface UserInput {
    username: string
    email: string
    password: string
}

export interface LoginCredentials {
    email: string
    password: string
}
