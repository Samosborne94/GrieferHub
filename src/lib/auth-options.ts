import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '@/lib/auth'
import { AirtableService } from '@/lib/services/airtable'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required')
                }

                // Get user from Airtable
                const user = await AirtableService.getUserByEmail(credentials.email)

                if (!user) {
                    throw new Error('No user found with this email')
                }

                // Verify password
                const isValid = await verifyPassword(credentials.password, user.password)

                if (!isValid) {
                    throw new Error('Invalid password')
                }

                // Return user without password
                return {
                    id: user.id,
                    email: user.email,
                    name: user.username,
                    role: user.role,
                }
            },
        }),
    ],

    // Use JWT strategy (no database adapter needed)
    session: {
        strategy: 'jwt',
    },

    // Callbacks
    callbacks: {
        async jwt({ token, user }) {
            // Add user info to token on sign in
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            // Add user info to session
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role
            }
            return session
        },
    },

    // Custom pages
    pages: {
        signIn: '/login',
        error: '/login',
    },

    // Secret
    secret: process.env.NEXTAUTH_SECRET,
}
