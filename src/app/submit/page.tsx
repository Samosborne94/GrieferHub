'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'

export default function SubmitReportPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    grieferName: '',
    game: 'Arc Raiders', // Default to Arc Raiders as requested
    server: '',
    description: '',
    severity: 'Medium',
    evidenceUrl: '', // In a real app, we'd handle file upload here
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Mock submission for now (since we don't have a real backend connected in this verifying environment yet)
      // In production, this would POST to /api/reports

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('Report submitted:', formData)

      // Redirect to a "success" or dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Failed to submit report. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto glass rounded-2xl p-8 md:p-12 border border-accent-primary/20 shadow-[0_0_30px_rgba(255,68,68,0.1)]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">
              Report <span className="text-accent-primary">Betrayal</span>
            </h1>
            <p className="text-text-secondary">
              Submit verified intelligence on a griefer or fake friendly.
              <br />
              Your report helps squads survive.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Griefer IGN (In-Game Name)"
                name="grieferName"
                value={formData.grieferName}
                onChange={handleChange}
                placeholder="e.g. TrustMeBro"
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Game
                </label>
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                >
                  <option value="Arc Raiders">Arc Raiders</option>
                  <option value="Escape from Tarkov">Escape from Tarkov</option>
                  <option value="Rust">Rust</option>
                  <option value="DayZ">DayZ</option>
                </select>
              </div>
            </div>

            <Input
              label="Region / Server (Optional)"
              name="server"
              value={formData.server}
              onChange={handleChange}
              placeholder="e.g. EU West / London"
            />

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Incident Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all resize-none"
                placeholder="Describe what happened. Was it a Fake Friendly encounter? Did they loot steal? Be specific."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Severity Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, severity: level }))}
                    className={`
                      py-2 rounded-lg text-sm font-medium border transition-all
                      ${formData.severity === level
                        ? 'bg-accent-primary text-white border-accent-primary shadow-[0_0_10px_rgba(255,68,68,0.3)]'
                        : 'bg-bg-tertiary text-text-secondary border-gray-700 hover:border-text-secondary'}
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" size="lg" className="w-full uppercase tracking-wide font-bold" isLoading={isLoading}>
                Submit Intelligence
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
