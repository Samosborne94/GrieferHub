/**
 * API Key types for Phase 8 implementation
 */

export type ApiKeyScope =
    | 'reports:read'
    | 'reports:write'
    | 'reports:delete'
    | 'comments:read'
    | 'comments:write'
    | 'users:read'

export interface ApiKey {
    id: string
    userId: string
    name: string
    keyPrefix: string // First 8 characters for identification (e.g., "ghk_abcd")
    hashedKey: string // Full key hashed with bcrypt
    scopes: ApiKeyScope[]
    rateLimit: number // Requests per minute
    usageCount: number
    lastUsed: Date | null
    expiresAt: Date | null
    isActive: boolean
    createdAt: Date
}

export interface ApiKeyInput {
    name: string
    scopes?: ApiKeyScope[]
    rateLimit?: number
    expiresAt?: Date | null
}

export interface ApiKeyWithKey extends Omit<ApiKey, 'hashedKey'> {
    key: string // Only returned once on creation
}

export interface ApiKeyListItem extends Omit<ApiKey, 'hashedKey'> {
    // Public view without hashed key
}
