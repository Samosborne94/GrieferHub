export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface ApiError {
    error: string
    message: string
    statusCode: number
}

export interface UploadResponse {
    success: boolean
    url: string
    publicId: string
}
