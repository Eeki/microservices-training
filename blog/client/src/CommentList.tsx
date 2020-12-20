import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Comment {
  id: string
  content: string
}

interface CommentListProps {
  postId: string
}

export default ({ postId }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([])

  const fetchComments = async () => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`)
    setComments(res.data)
  }

  useEffect(() => {
    fetchComments()
  }, [])


  const renderedComments = comments.map((comment) =>
    <li key={comment.id}>{comment.content}</li>
  )


  return (
    <ul>
      {renderedComments}
    </ul>
  )
}
