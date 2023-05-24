import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogAuthor, setNewBlogAuthor] = useState('')
    const [newBlogUrl, setNewBlogUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newBlogTitle,
            author: newBlogAuthor,
            url: newBlogUrl
        })

        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
            <div>
                title:
                <input
                type="text"
                value={newBlogTitle}
                name="Title"
                onChange={({ target }) => setNewBlogTitle(target.value)}
                id = 'title-input'
                />
            </div>
            <div>
                author:
                <input
                type="text"
                value={newBlogAuthor}
                name="Author"
                onChange={({ target }) => setNewBlogAuthor(target.value)}
                id = 'author-input'
                />
            </div>
            <div>
                url:
                <input
                type="text"
                value={newBlogUrl}
                name="Url"
                onChange={({ target }) => setNewBlogUrl(target.value)}
                id = 'url-input'
                />
            </div>
            <button id='create-button' type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm