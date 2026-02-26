export type NotificationType =
    | 'report_status_change'
    | 'comment_reply'
    | 'report_verified'
    | 'report_rejected'

export interface Notification {
    id: string
    userId: string
    type: NotificationType
    title: string
    message: string
    relatedReportId?: string
    isRead: boolean
    createdAt: Date
}
