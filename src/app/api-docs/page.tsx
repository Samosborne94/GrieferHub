import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
    title: 'API Documentation',
    description: 'GrieferHub Public API documentation for developers',
}

export default function APIDocsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                            API Documentation
                        </h1>
                        <p className="text-text-secondary">
                            Public API for accessing verified griefer reports
                        </p>
                    </div>

                    {/* Overview */}
                    <div className="glass rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">
                            Overview
                        </h2>
                        <p className="text-text-secondary mb-4">
                            The GrieferHub Public API provides programmatic access to verified
                            griefer reports. All endpoints are read-only and return JSON
                            responses.
                        </p>
                        <div className="bg-bg-tertiary rounded p-4">
                            <p className="text-sm text-text-tertiary mb-2">Base URL:</p>
                            <code className="text-accent-primary">
                                https://grieferhub.com/api/public
                            </code>
                        </div>
                    </div>

                    {/* Authentication */}
                    <div className="glass rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">
                            Authentication
                        </h2>
                        <p className="text-text-secondary">
                            The public API does not require authentication. All endpoints are
                            publicly accessible and return only verified reports.
                        </p>
                    </div>

                    {/* Endpoints */}
                    <div className="glass rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-6">
                            Endpoints
                        </h2>

                        {/* GET /reports */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 rounded bg-green-900/20 border border-green-700 text-green-500 text-sm font-mono">
                                    GET
                                </span>
                                <code className="text-text-primary">/api/public/reports</code>
                            </div>
                            <p className="text-text-secondary mb-4">
                                Retrieve a paginated list of verified griefer reports.
                            </p>

                            <h4 className="text-sm font-semibold text-text-primary mb-2">
                                Query Parameters:
                            </h4>
                            <div className="bg-bg-tertiary rounded p-4 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-2 text-text-tertiary">
                                                Parameter
                                            </th>
                                            <th className="text-left py-2 text-text-tertiary">
                                                Type
                                            </th>
                                            <th className="text-left py-2 text-text-tertiary">
                                                Description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-text-secondary">
                                        <tr>
                                            <td className="py-2">
                                                <code>page</code>
                                            </td>
                                            <td className="py-2">number</td>
                                            <td className="py-2">Page number (default: 1)</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">
                                                <code>limit</code>
                                            </td>
                                            <td className="py-2">number</td>
                                            <td className="py-2">
                                                Results per page (default: 20, max: 100)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">
                                                <code>game</code>
                                            </td>
                                            <td className="py-2">string</td>
                                            <td className="py-2">Filter by game name</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">
                                                <code>severity</code>
                                            </td>
                                            <td className="py-2">string</td>
                                            <td className="py-2">
                                                Filter by severity (Low, Medium, High, Critical)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">
                                                <code>search</code>
                                            </td>
                                            <td className="py-2">string</td>
                                            <td className="py-2">
                                                Search by griefer name or description
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h4 className="text-sm font-semibold text-text-primary mb-2">
                                Example Request:
                            </h4>
                            <div className="bg-bg-tertiary rounded p-4 mb-4">
                                <code className="text-accent-primary text-sm">
                                    GET
                                    /api/public/reports?game=Minecraft&severity=High&page=1&limit=20
                                </code>
                            </div>

                            <h4 className="text-sm font-semibold text-text-primary mb-2">
                                Example Response:
                            </h4>
                            <div className="bg-bg-tertiary rounded p-4 overflow-x-auto">
                                <pre className="text-accent-primary text-xs">
                                    {`{
  "success": true,
  "data": [
    {
      "id": "rec123abc",
      "grieferName": "GrieferPlayer123",
      "game": "Minecraft",
      "description": "Destroyed base...",
      "evidenceUrl": "https://...",
      "status": "Verified",
      "severity": "High",
      "server": "US West",
      "tags": ["griefing", "destruction"],
      "createdAt": "2026-01-10T12:00:00Z",
      "updatedAt": "2026-01-11T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "meta": {
    "api_version": "1.0",
    "documentation": "/api-docs"
  }
}`}
                                </pre>
                            </div>
                        </div>

                        {/* GET /reports/[id] */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 rounded bg-green-900/20 border border-green-700 text-green-500 text-sm font-mono">
                                    GET
                                </span>
                                <code className="text-text-primary">
                                    /api/public/reports/:id
                                </code>
                            </div>
                            <p className="text-text-secondary mb-4">
                                Retrieve a single verified report by ID.
                            </p>

                            <h4 className="text-sm font-semibold text-text-primary mb-2">
                                Example Request:
                            </h4>
                            <div className="bg-bg-tertiary rounded p-4 mb-4">
                                <code className="text-accent-primary text-sm">
                                    GET /api/public/reports/rec123abc
                                </code>
                            </div>

                            <h4 className="text-sm font-semibold text-text-primary mb-2">
                                Example Response:
                            </h4>
                            <div className="bg-bg-tertiary rounded p-4 overflow-x-auto">
                                <pre className="text-accent-primary text-xs">
                                    {`{
  "success": true,
  "data": {
    "id": "rec123abc",
    "grieferName": "GrieferPlayer123",
    "game": "Minecraft",
    "description": "Destroyed base...",
    "evidenceUrl": "https://...",
    "status": "Verified",
    "severity": "High",
    "server": "US West",
    "tags": ["griefing", "destruction"],
    "createdAt": "2026-01-10T12:00:00Z",
    "updatedAt": "2026-01-11T10:30:00Z"
  },
  "meta": {
    "api_version": "1.0",
    "documentation": "/api-docs"
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Rate Limiting */}
                    <div className="glass rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">
                            Rate Limiting
                        </h2>
                        <p className="text-text-secondary mb-4">
                            The API is currently unlimited but fair use is expected. Excessive
                            requests may be throttled.
                        </p>
                        <p className="text-text-tertiary text-sm">
                            Note: Rate limiting may be implemented in the future to ensure fair
                            access for all users.
                        </p>
                    </div>

                    {/* Error Handling */}
                    <div className="glass rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-text-primary mb-4">
                            Error Responses
                        </h2>
                        <p className="text-text-secondary mb-4">
                            All errors follow a consistent format:
                        </p>
                        <div className="bg-bg-tertiary rounded p-4 overflow-x-auto">
                            <pre className="text-accent-primary text-xs">
                                {`{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message"
}`}
                            </pre>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-text-primary mb-2">
                                Common Error Codes:
                            </h4>
                            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                                <li>
                                    <code>404</code> - Resource not found
                                </li>
                                <li>
                                    <code>403</code> - Access forbidden (unverified reports)
                                </li>
                                <li>
                                    <code>500</code> - Internal server error
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
