'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Validate password length
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || 'Registration failed')
            } else {
                // Redirect to login on success
                router.push('/login?registered=true')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center container py-12">
                <div className="w-full max-w-md">
                    <div className="glass rounded-lg p-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">
                            Create Account
                        </h1>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="text"
                                name="username"
                                label="Username"
                                placeholder="JohnDoe"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                type="email"
                                name="email"
                                label="Email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                type="password"
                                name="password"
                                label="Password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                helperText="Minimum 8 characters"
                                required
                            />

                            <Input
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Register
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-text-secondary">
                            Already have an account?{' '}
                            <Link href="/login" className="text-accent-primary hover:text-accent-secondary">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
