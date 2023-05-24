import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [showMore, setShowMore] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (showMore) {
    return (
      <div style={blogStyle} className='blog'>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setShowMore(!showMore)}>
            {showMore ? 'hide' : 'view'}
          </button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        </div>
        <div>
          {blog.user.name}
        </div>
        {blog.user.username === JSON.parse(window.localStorage.getItem('loggedBlogappUser')).username && (
          <div>
            <button onClick={() => handleRemove(blog)}>
              remove
            </button>
          </div>
        )}
      </div>
    )
  }

  return (

    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowMore(!showMore)}>
          {showMore ? 'hide' : 'view'}
        </button>
      </div>
    </div>
  
)}

export default Blog