export type ReportStatus = 'Verified' | 'Under Review' | 'Resolved' | 'Rejected'
export type ReportSeverity = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Report {
    id: string
    reporterId: string
    grieferName: string
    game: string
    description: string
    evidenceUrl: string
    status: ReportStatus
    severity: ReportSeverity
    server?: string
    tags?: string[]
    createdAt: Date
    updatedAt: Date
}

export interface ReportInput {
    grieferName: string
    game: string
    description: string
    evidenceUrl: string
    severity: ReportSeverity
    server?: string
    tags?: string[]
}

export interface ReportFilters {
    game?: string
    status?: ReportStatus
    severity?: ReportSeverity
    search?: string
    reporterId?: string
    page?: number
    limit?: number
}
