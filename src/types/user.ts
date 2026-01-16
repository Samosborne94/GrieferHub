export type UserRole = 'user' | 'moderator' | 'admin'

export interface User {
    id: string
    username: string
    email: string
    role: UserRole
    createdAt: Date
}

export interface UserProfile extends User {
    bio?: string
    avatar?: string
    location?: string
    website?: string
    discord?: string
    steam?: string
    reputationScore: number
    totalReports: number
    verifiedReports: number
    totalComments: number
}

export interface UserProfileUpdate {
    bio?: string
    avatar?: string
    location?: string
    website?: string
    discord?: string
    steam?: string
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

export interface UserStats {
    totalReports: number
    verifiedReports: number
    underReviewReports: number
    resolvedReports: number
    rejectedReports: number
    totalComments: number
    reputationScore: number
    joinDate: Date
}
