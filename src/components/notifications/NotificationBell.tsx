'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface NotificationItem {
    id: string
    type: string
    title: string
    message: string
    relatedReportId?: string
    isRead: boolean
    createdAt: string
}

function timeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

export const NotificationBell: React.FC = () => {
    const router = useRouter()
    const [unreadCount, setUnreadCount] = useState(0)
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Poll unread count
    useEffect(() => {
        async function fetchCount() {
            try {
                const res = await fetch('/api/notifications/unread-count')
                const json = await res.json()
                if (json.success) {
                    setUnreadCount(json.data.count)
                }
            } catch {
                // Silently ignore
            }
        }

        fetchCount()
        const interval = setInterval(fetchCount, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function toggleDropdown() {
        if (!open) {
            setLoading(true)
            try {
                const res = await fetch('/api/notifications')
                const json = await res.json()
                if (json.success) {
                    setNotifications(json.data.slice(0, 5))
                }
            } catch {
                // Silently ignore
            } finally {
                setLoading(false)
            }
        }
        setOpen(!open)
    }

    async function handleNotificationClick(notification: NotificationItem) {
        // Mark as read
        if (!notification.isRead) {
            try {
                await fetch(`/api/notifications/${notification.id}/read`, { method: 'PUT' })
                setUnreadCount(prev => Math.max(0, prev - 1))
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
                )
            } catch {
                // Silently ignore
            }
        }

        setOpen(false)

        if (notification.relatedReportId) {
            router.push(`/report/${notification.relatedReportId}`)
        }
    }

    async function handleMarkAllRead() {
        try {
            await fetch('/api/notifications/read-all', { method: 'PUT' })
            setUnreadCount(0)
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        } catch {
            // Silently ignore
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                aria-label="Notifications"
            >
                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 glass rounded-xl border border-border-primary shadow-lg overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
                        <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-accent-primary hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="p-4 text-center">
                            <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-6 text-center text-text-tertiary text-sm">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map(notification => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full text-left px-4 py-3 hover:bg-bg-elevated transition-colors border-b border-border-secondary last:border-b-0 ${
                                        !notification.isRead ? 'bg-accent-primary/5' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {!notification.isRead && (
                                            <span className="mt-1.5 w-2 h-2 rounded-full bg-accent-primary flex-shrink-0" />
                                        )}
                                        <div className={!notification.isRead ? '' : 'ml-4'}>
                                            <p className="text-sm font-medium text-text-primary">{notification.title}</p>
                                            <p className="text-xs text-text-tertiary mt-0.5 line-clamp-2">{notification.message}</p>
                                            <p className="text-xs text-text-muted mt-1">{timeAgo(notification.createdAt)}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
