import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@/types/api'
import {
    AppError,
    internalError,
    isAppError,
    validationError,
} from '@/lib/errors'
import { logServerError } from '@/lib/logger'

export function apiSuccess<T>(
    data?: T,
    options?: { status?: number; message?: string }
) {
    return NextResponse.json<ApiResponse<T>>(
        {
            success: true,
            data,
            message: options?.message,
        },
        { status: options?.status ?? 200 }
    )
}

export function apiError(error: AppError) {
    return NextResponse.json<ApiResponse>(
        {
            success: false,
            error: error.code,
            message: error.expose ? error.message : 'Internal server error',
        },
        { status: error.statusCode }
    )
}

export async function parseJsonBody<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): Promise<T> {
    let body: unknown

    try {
        body = await request.json()
    } catch (error) {
        throw validationError('Request body must be valid JSON', error)
    }

    const result = schema.safeParse(body)

    if (!result.success) {
        throw validationError(result.error.issues[0]?.message ?? 'Validation failed', result.error.flatten())
    }

    return result.data
}

export function getAuthenticatedUserId(session: { user?: { id?: string | null } } | null | undefined) {
    const userId = session?.user?.id

    if (!userId) {
        throw new AppError({
            code: 'UNAUTHORIZED',
            message: 'Authentication is required',
            statusCode: 401,
        })
    }

    return userId
}

export function handleApiError(
    error: unknown,
    request: NextRequest,
    context: string,
    metadata?: Record<string, unknown>
) {
    const requestId = request.headers.get('x-request-id') ?? undefined
    const normalizedError = isAppError(error)
        ? error
        : internalError(`${context} failed`, error)

    logServerError(context, error, {
        ...metadata,
        requestId,
        path: request.nextUrl.pathname,
        method: request.method,
    })

    return apiError(normalizedError)
}
