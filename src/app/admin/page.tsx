'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/common/Button'
import type { User, UserRole } from '@/types/user'

export default function AdminDashboardPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    // Check if user is admin
    const isAdmin = session?.user?.role === 'admin'

    // Redirect if not authenticated or not admin
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/admin')
        } else if (status === 'authenticated' && !isAdmin) {
            router.push('/')
        }
    }, [status, isAdmin, router])

    // Fetch users
    useEffect(() => {
        if (status === 'authenticated' && isAdmin) {
            fetchUsers()
        }
    }, [status, isAdmin])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/users')
            const data = await response.json()

            if (data.success) {
                setUsers(data.data || [])
                setError(null)
            } else {
                setError(data.message || data.error || 'Failed to fetch users')
            }
        } catch (err) {
            setError('Failed to fetch users')
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
        if (
            !confirm(
                `Are you sure you want to change this user's role to ${newRole}?`
            )
        ) {
            return
        }

        try {
            setUpdatingId(userId)

            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            })

            const data = await response.json()

            if (data.success) {
                // Update local state
                setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
                )
            } else {
                alert(data.message || 'Failed to update role')
            }
        } catch (err) {
            console.error('Error updating role:', err)
            alert('Failed to update role')
        } finally {
            setUpdatingId(null)
        }
    }

    if (status === 'loading' || (status === 'authenticated' && loading)) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </main>
                <Footer />
            </div>
        )
    }

    if (status === 'unauthenticated' || !isAdmin) {
        return null // Will redirect
    }

    // Stats
    const stats = {
        total: users.length,
        admins: users.filter((u) => u.role === 'admin').length,
        moderators: users.filter((u) => u.role === 'moderator').length,
        users: users.filter((u) => u.role === 'user').length,
    }

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'bg-red-900/20 border-red-700 text-red-500'
            case 'moderator':
                return 'bg-blue-900/20 border-blue-700 text-blue-500'
            default:
                return 'bg-gray-700/20 border-gray-600 text-gray-400'
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-text-secondary">Manage users and permissions</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-text-primary mb-1">
                            {stats.total}
                        </div>
                        <div className="text-sm text-text-tertiary">Total Users</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-red-500 mb-1">
                            {stats.admins}
                        </div>
                        <div className="text-sm text-text-tertiary">Admins</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-blue-500 mb-1">
                            {stats.moderators}
                        </div>
                        <div className="text-sm text-text-tertiary">Moderators</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-gray-400 mb-1">
                            {stats.users}
                        </div>
                        <div className="text-sm text-text-tertiary">Regular Users</div>
                    </div>
                </div>

                {/* Quick Access */}
                <div className="glass rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">
                        Quick Access
                    </h2>
                    <div className="flex gap-4">
                        <Button onClick={() => router.push('/mod')}>
                            Moderation Dashboard
                        </Button>
                        <Button onClick={() => router.push('/intel')} variant="ghost">
                            View Intel Board
                        </Button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="glass rounded-lg p-8 text-center mb-8">
                        <p className="text-red-500 mb-2">Error loading users</p>
                        <p className="text-text-tertiary text-sm">{error}</p>
                        <Button onClick={fetchUsers} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Users List */}
                {!error && (
                    <div className="glass rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-lg font-semibold text-text-primary">
                                User Management ({users.length})
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-bg-tertiary">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-bg-tertiary/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-text-primary">
                                                    {user.username}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-text-secondary">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs border ${getRoleBadgeColor(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    {user.role !== 'moderator' && (
                                                        <button
                                                            onClick={() =>
                                                                handleRoleUpdate(
                                                                    user.id,
                                                                    'moderator'
                                                                )
                                                            }
                                                            disabled={
                                                                updatingId === user.id ||
                                                                user.id === session?.user?.id
                                                            }
                                                            className="px-2 py-1 rounded bg-blue-900/20 border border-blue-700 text-blue-500 hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                                                        >
                                                            Make Mod
                                                        </button>
                                                    )}
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() =>
                                                                handleRoleUpdate(user.id, 'admin')
                                                            }
                                                            disabled={
                                                                updatingId === user.id ||
                                                                user.id === session?.user?.id
                                                            }
                                                            className="px-2 py-1 rounded bg-red-900/20 border border-red-700 text-red-500 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                    {user.role !== 'user' && (
                                                        <button
                                                            onClick={() =>
                                                                handleRoleUpdate(user.id, 'user')
                                                            }
                                                            disabled={
                                                                updatingId === user.id ||
                                                                user.id === session?.user?.id
                                                            }
                                                            className="px-2 py-1 rounded bg-gray-700/20 border border-gray-600 text-gray-400 hover:bg-gray-700/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                                                        >
                                                            Demote
                                                        </button>
                                                    )}
                                                </div>
                                                {user.id === session?.user?.id && (
                                                    <div className="text-xs text-text-tertiary mt-1">
                                                        (You)
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
