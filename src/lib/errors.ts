export type ErrorCode =
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'CONFLICT'
    | 'CONFIG_ERROR'
    | 'EXTERNAL_SERVICE_ERROR'
    | 'INTERNAL_ERROR'

export class AppError extends Error {
    readonly code: ErrorCode
    readonly statusCode: number
    readonly expose: boolean
    readonly details?: unknown

    constructor(options: {
        code: ErrorCode
        message: string
        statusCode: number
        expose?: boolean
        details?: unknown
        cause?: unknown
    }) {
        super(options.message)
        this.name = 'AppError'
        this.code = options.code
        this.statusCode = options.statusCode
        this.expose = options.expose ?? true
        this.details = options.details
        if (options.cause !== undefined) {
            ;(this as Error & { cause?: unknown }).cause = options.cause
        }
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError
}

export function unauthorized(message: string = 'Authentication is required') {
    return new AppError({
        code: 'UNAUTHORIZED',
        message,
        statusCode: 401,
    })
}

export function forbidden(message: string = 'You are not allowed to perform this action') {
    return new AppError({
        code: 'FORBIDDEN',
        message,
        statusCode: 403,
    })
}

export function notFound(message: string = 'Resource not found') {
    return new AppError({
        code: 'NOT_FOUND',
        message,
        statusCode: 404,
    })
}

export function conflict(message: string) {
    return new AppError({
        code: 'CONFLICT',
        message,
        statusCode: 409,
    })
}

export function validationError(message: string, details?: unknown) {
    return new AppError({
        code: 'VALIDATION_ERROR',
        message,
        statusCode: 400,
        details,
    })
}

export function configError(message: string, details?: unknown) {
    return new AppError({
        code: 'CONFIG_ERROR',
        message,
        statusCode: 500,
        expose: false,
        details,
    })
}

export function externalServiceError(message: string, cause?: unknown) {
    return new AppError({
        code: 'EXTERNAL_SERVICE_ERROR',
        message,
        statusCode: 502,
        expose: false,
        cause,
    })
}

export function internalError(message: string, cause?: unknown) {
    return new AppError({
        code: 'INTERNAL_ERROR',
        message,
        statusCode: 500,
        expose: false,
        cause,
    })
}
