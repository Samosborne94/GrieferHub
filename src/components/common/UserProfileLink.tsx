'use client'

import Link from 'next/link'
import type { UserRole } from '@/types/user'

interface UserProfileLinkProps {
    username: string
    role?: UserRole
    className?: string
}

export const UserProfileLink: React.FC<UserProfileLinkProps> = ({ username, role, className }) => {
    const roleColor =
        role === 'moderator'
            ? 'text-green-400 hover:text-green-300'
            : role === 'admin'
            ? 'text-red-400 hover:text-red-300'
            : 'text-text-primary hover:text-accent-primary'

    return (
        <Link
            href={`/player/${encodeURIComponent(username)}`}
            className={`font-semibold text-sm transition-colors ${roleColor} ${className || ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            {username}
        </Link>
    )
}
