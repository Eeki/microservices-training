import React, { useState } from 'react'
import axios from 'axios'

interface CommentCreateProps {
  postId: string
}

export default ({ postId }: CommentCreateProps) => {
  const [content, setContent] = useState('')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content
    })

    setContent('')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input value={content} onChange={e => setContent(e.target.value)} className="form-control" />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
