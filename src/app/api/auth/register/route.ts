import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
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
        const body = await request.json()

        // Validate input
        const validationResult = registerSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: validationResult.error.issues[0].message,
                },
                { status: 400 }
            )
        }

        const { username, email, password } = validationResult.data

        // Check if user already exists
        const existingUser = await AirtableService.getUserByEmail(email)

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User already exists',
                    message: 'An account with this email already exists',
                },
                { status: 409 }
            )
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

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                message: 'User registered successfully',
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: 'Failed to register user',
            },
            { status: 500 }
        )
    }
}
