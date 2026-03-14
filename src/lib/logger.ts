import { isAppError } from '@/lib/errors'

type LogLevel = 'error' | 'warn' | 'info'

function serializeError(error: unknown) {
    if (error instanceof Error) {
        const errorWithCause = error as Error & { cause?: unknown }

        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: errorWithCause.cause,
        }
    }

    return {
        name: 'NonError',
        message: typeof error === 'string' ? error : 'Unknown error',
        value: error,
    }
}

function write(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const payload = {
        level,
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
    }

    const line = JSON.stringify(payload)

    if (level === 'error') {
        console.error(line)
        return
    }

    if (level === 'warn') {
        console.warn(line)
        return
    }

    console.info(line)
}

export function logServerError(
    message: string,
    error: unknown,
    metadata?: Record<string, unknown>
) {
    write('error', message, {
        ...metadata,
        error: serializeError(error),
        appError: isAppError(error)
            ? {
                code: error.code,
                statusCode: error.statusCode,
                expose: error.expose,
                details: error.details,
            }
            : undefined,
    })
}
