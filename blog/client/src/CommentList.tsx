import React from 'react'

export interface Comment {
  id: string
  content: string
  status: 'approved' | 'rejected' | 'pending'
}

interface CommentListProps {
  comments: Comment[]
}

export default ({ comments }: CommentListProps) => {
  const renderedComments = comments.map((comment) => {
    let content = ''
    if (comment.status === 'approved') {
      content = comment.content
    }
    if (comment.status === 'pending') {
      content = 'This comment is awaiting moderation'
    }
    if (comment.status === 'rejected') {
      content = 'This comment has been rejected'
    }
    return <li key={comment.id}>{content}</li>
    }
  )
  return (
    <ul>
      {renderedComments}
    </ul>
  )
}
