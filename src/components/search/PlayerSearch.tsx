'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'

export const PlayerSearch = () => {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim()) return

        setIsLoading(true)
        router.push(`/player/${encodeURIComponent(username.trim())}`)
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center">
                <div className="relative w-full">
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Search player (e.g., TrustMeBro)..."
                        className="w-full pr-24 h-12 bg-bg-tertiary/80 backdrop-blur-sm border-accent-muted focus:border-accent-primary transition-all duration-300 rounded-xl"
                        required
                    />
                    <div className="absolute right-1 top-1 bottom-1">
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            className="h-full px-6 rounded-lg"
                            isLoading={isLoading}
                            glow
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
