export interface Comment {
    id: string
    reportId: string
    authorId: string
    authorUsername: string
    authorRole: 'user' | 'moderator' | 'admin'
    content: string
    createdAt: Date
    updatedAt: Date
    isEdited: boolean
}

export interface CommentInput {
    reportId: string
    content: string
}

export interface CommentWithAuthor extends Comment {
    isOwner: boolean
}
