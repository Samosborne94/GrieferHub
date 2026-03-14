import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { apiSuccess, handleApiError, parseJsonBody } from '@/lib/api/route'
import { conflict } from '@/lib/errors'
import { AirtableService } from '@/lib/services/airtable'
import { hashPassword } from '@/lib/auth'

// Validation schema
const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(100),
})

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await parseJsonBody(request, registerSchema)

        // Check if user already exists
        const existingUser = await AirtableService.getUserByEmail(email)

        if (existingUser) {
            throw conflict('An account with this email already exists')
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await AirtableService.createUser({
            username,
            email,
            password, // This will be hashed in the service
            hashedPassword,
        })

        return apiSuccess(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            { status: 201, message: 'User registered successfully' }
        )
    } catch (error) {
        return handleApiError(error, request, 'Registration')
    }
}
