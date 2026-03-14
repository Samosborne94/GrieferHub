import bcrypt from 'bcryptjs'
import { getServerSession as getNextAuthSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { forbidden, unauthorized } from '@/lib/errors'

export { authOptions }

/**
 * Hash a password using bcrypt (10 rounds)
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

/**
 * Get the current server session
 * Use in Server Components and API routes
 */
export async function getServerSession() {
    return getNextAuthSession(authOptions)
}

/**
 * Require authentication - throws error if not authenticated
 * Use in API routes
 */
export async function requireAuth() {
    const session = await getServerSession()

    if (!session || !session.user) {
        throw unauthorized()
    }

    return session
}

/**
 * Check if user has a specific role
 */
export function hasRole(
    userRole: string,
    requiredRole: 'user' | 'moderator' | 'admin'
): boolean {
    const roleHierarchy = { user: 0, moderator: 1, admin: 2 }
    return roleHierarchy[userRole as keyof typeof roleHierarchy] >=
        roleHierarchy[requiredRole]
}

/**
 * Require moderator or admin role - throws error if not authorized
 * Use in API routes
 */
export async function requireModerator() {
    const session = await requireAuth()

    if (!hasRole(session.user?.role || 'user', 'moderator')) {
        throw forbidden('Moderator or admin access is required')
    }

    return session
}

/**
 * Require admin role - throws error if not authorized
 * Use in API routes
 */
export async function requireAdmin() {
    const session = await requireAuth()

    if (!hasRole(session.user?.role || 'user', 'admin')) {
        throw forbidden('Admin access is required')
    }

    return session
}
